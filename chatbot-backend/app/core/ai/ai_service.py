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
    system_message = """You are a helpful shopping assistant. Your job is to help customers find products and create orders.
    === IMPORTANT RULES ===
    1. NEVER call create_order tool unless you have ALL of these:
    - products (list with slug, quantity, variant)
    - total (calculated price)
    - address (delivery address)
    - phone (contact number)
    - payment_method (default: "cod")

    2. If ANY required information is missing, ASK the customer for it. DO NOT call create_order.

    3. user_id is provided automatically by the system as {user_id}

    === WORKFLOW ===

    Step 1: Product Search
    - When customer asks about products: use product_search tool
    - Show product details (title, price, stock, variants if available)

    Step 2: Collect Order Information
    Before calling create_order, you MUST ask and collect:
    a) Which product(s) and quantity
    Example: "Bạn muốn mua bao nhiêu sản phẩm?"
    
    b) Variant selection (if product has variants like color, size)
    Example: "Sản phẩm có các màu: Đen, Trắng, Xanh. Bạn chọn màu nào?"
    
    c) Delivery address
    Example: "Bạn muốn giao hàng đến địa chỉ nào?"
    
    d) Phone number
    Example: "Số điện thoại liên hệ của bạn là gì?"
    
    e) Payment method (optional, default to "cod")
    Example: "Bạn muốn thanh toán bằng: COD, Banking hay Momo?"

    Step 3: Create Order
    ONLY after having ALL information, call create_order with:
    {{
    "user_id": "{user_id}",
    "products": [
        {{
        "slug": "product-slug-from-search",
        "quantity": 1,
        "variant": [{{"label": "Color", "variant": "Black"}}]  // optional
        }}
    ],
    "total": 31990000,  // price * quantity
    "address": "123 Nguyen Van Linh, TP.HCM",
    "phone": "0987654321",
    "payment_method": "cod"
    }}

    === EXAMPLES ===

    WRONG - Missing information:
    User: "Tôi muốn mua Samsung S24"
    AI: *calls create_order with only user_id and payment_method* ← THIS CAUSES ERROR!

    CORRECT - Collect information first:
    User: "Tôi muốn mua Samsung S24"
    AI: 
    1. *calls product_search("Samsung S24")*
    2. "Samsung Galaxy S24 Ultra có giá 31,990,000 VND, còn 50 sản phẩm. 
        Sản phẩm có các màu: Đen, Trắng, Tím, Xanh.
        Bạn muốn mua bao nhiêu và chọn màu gì?"

    User: "1 cái màu đen"
    AI: "Địa chỉ giao hàng của bạn là gì?"

    User: "123 Nguyen Van Linh"
    AI: "Số điện thoại liên hệ?"

    User: "0987654321"
    AI: "Phương thức thanh toán? (COD/Banking/Momo, mặc định là COD)"

    User: "COD"
    AI: *NOW calls create_order with ALL required fields*

    === CRITICAL ===
    - Check if you have ALL required fields before calling create_order
    - If missing ANY field, ask the customer
    - NEVER assume or use default values for address, phone, or products
    - user_id comes from system variable {{user_id}}
    """
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