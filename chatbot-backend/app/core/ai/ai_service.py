from langchain.tools import BaseTool
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import os
from typing import List, Dict, AsyncGenerator, Any, Optional
from dotenv import load_dotenv
from app.database.chat_history_service import save_chat_history, get_recent_chat_history, format_chat_history
from pydantic import BaseModel, Field
from langchain_core.messages import AIMessageChunk
from langchain.callbacks.base import BaseCallbackHandler
from .tools import ProductSearchTool, CreateOrderTool

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

# Create tools
product_search_tool = ProductSearchTool()
create_order_tool = CreateOrderTool()

class CustomHandler(BaseCallbackHandler):
    """
    Lớp xử lý callback tùy chỉnh để theo dõi và xử lý các sự kiện trong quá trình chat
    """
    def __init__(self):
        super().__init__()

def get_llm_and_agent() -> AgentExecutor:
    system_message = """You are an assistant that helps users place product orders. If the user provides their user ID, product(s), total amount, address, phone, and payment method, use the create_order tool to finalize the order without asking further.

For general questions or greetings:
- Respond naturally without using any tools
- Be friendly and professional
- Keep responses concise and helpful

For product-related questions or purchase intentions:
1. When customer asks about products:
   - Use product_search tool to find product information
   - Present product details in a clear format
   - If they show interest in buying, ask for quantity and variant choices if applicable

2. When customer decides to buy:
   - Use product_search to get latest information
   - Collect necessary information from customer:
     + Product and quantity
     + Variant selections if applicable
     + Delivery address
     + Phone number
     + Payment method (default to "cod" if not specified)
   - Format product information properly:
     + Use {{title}} from search results
     + Include quantity and variants as specified by customer
   - Calculate total = price × quantity
   - Use create_order tool with:
     + {{user_id}}={user_id}
     + {{products}}=[{{"slug": "<slug>", "quantity": <quantity>, "variant": [...]}}]
     + {{total}}=<calculated total>
     + {{address}}=<customer address>
     + {{phone}}=<customer phone>
     + {{payment_method}}="cod" (or as specified)
     + {{coupon}}=<coupon_id if provided>
   - Handle any error cases (insufficient stock, invalid variants, etc.)
   - Confirm successful order creation

IMPORTANT RULES:
- Only use product_search when questions are about products or purchases
- All product information MUST come from latest product_search result
- Always get {{title}} from search results to use with create_order
- Format money amounts in VND format (e.g., 31,990,000 VND)
- Collect all required information before creating an order
- Validate that variants match available options for the product

Example flow:
1. Customer: "I want to buy Samsung S24"
2. Bot: 
   - Call product_search("Samsung S24")
   - Show product info and ask for quantity and variant choices
3. Customer: "I want 1 in Black color"
4. Bot:
   - Ask for delivery address and phone number
5. Customer: Provides address and phone
6. Bot:
   - Call create_order with:
     {{user_id}} = {user_id}.
     {{products}}=[{{"slug": "samsung-s24", "quantity": 1, "variant": [{{"label": "Color", "variant": "Black"}}]}}]
     {{total}}=31990000
     {{address}}="123 Main St"
     {{phone}}="0123456789"
     {{payment_method}}="cod"
   - Inform customer of the result"""
    
    # Use ChatOpenAI
    chat = ChatOpenAI(
        temperature=0, 
        streaming=True, 
        model="gpt-4o-mini", 
        api_key=OPENAI_API_KEY,
        callbacks=[CustomHandler()]
    )

    tools = [
        product_search_tool,
        create_order_tool,  # Uncomment when you implement this tool
    ]

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_message),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])

    agent = create_openai_functions_agent(
        llm=chat,
        tools=tools,
        prompt=prompt
    )

    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=False,
        return_intermediate_steps=True
    )

    return agent_executor

def get_answer(question: str, thread_id: str, user_id: Optional[str] = None) -> Dict:
    """
    Hàm lấy câu trả lời cho một câu hỏi
    
    Args:
        question (str): Câu hỏi của người dùng
        thread_id (str): ID của cuộc trò chuyện
        
    Returns:
        Dict: Kết quả từ AI bao gồm câu trả lời và các bước thực hiện
    """
    agent = get_llm_and_agent()
    
    # Get recent chat history
    history = get_recent_chat_history(thread_id)
    chat_history = format_chat_history(history)
    
    result = agent.invoke({
        "input": question,
        "chat_history": chat_history,
        "user_id": user_id  
    })
    
    # Save chat history to database
    if isinstance(result, dict) and "output" in result:
        save_chat_history(thread_id, question, result["output"])
    
    return result

async def get_answer_stream(question: str, thread_id: str, user_id: Optional[str] = None) -> AsyncGenerator[str, None]:
    """
    Hàm lấy câu trả lời dạng stream cho một câu hỏi
    
    Args:
        question (str): Câu hỏi của người dùng
        thread_id (str): ID phiên chat
        
    Returns:
        AsyncGenerator[str, None]: Generator trả về từng phần của câu trả lời
    """
    # Khởi tạo agent với các tools cần thiết
    agent = get_llm_and_agent()
    
    # Lấy lịch sử chat gần đây
    history = get_recent_chat_history(thread_id)
    chat_history = format_chat_history(history)
    
    # Biến lưu câu trả lời hoàn chỉnh
    final_answer = ""
    
    # Stream từng phần của câu trả lời
    async for event in agent.astream_events(
        {
            "input": question,
            "chat_history": chat_history,
            "user_id": user_id 
        },
        version="v2"
    ):       
        # Lấy loại sự kiện
        kind = event["event"]
        # Nếu là sự kiện stream từ model
        if kind == "on_chat_model_stream":
            # Lấy nội dung token
            content = event['data']['chunk'].content
            if content:  # Chỉ yield nếu có nội dung
                # Cộng dồn vào câu trả lời hoàn chỉnh
                final_answer += content
                # Trả về token cho client
                yield content
    
    # Lưu câu trả lời hoàn chỉnh vào database
    if final_answer:
        save_chat_history(thread_id, question, final_answer)

if __name__ == "__main__":
    import asyncio
    
    async def test():
        async for event in get_answer_stream("hi", "test-session"):
            print('event:', event)
        print('done')
    
    asyncio.run(test())