import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime
from typing import List, Dict
from bson import ObjectId

# Tải thông tin từ .env
load_dotenv()

DB_NAME = os.getenv('DB_NAME')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = int(os.getenv('DB_PORT', 27017))  # Mặc định MongoDB chạy trên port 27017

# Kết nối đến MongoDB
def get_db_connection():
    """
    Tạo kết nối đến cơ sở dữ liệu MongoDB
    
    Returns:
        db: Đối tượng cơ sở dữ liệu MongoDB
    """
    client = MongoClient(DB_HOST, DB_PORT)
    return client[DB_NAME]

# Khởi tạo collection message trong MongoDB
def init_chat_history_collection():
    """
    Khởi tạo collection message trong MongoDB nếu chưa tồn tại
    Collection này lưu trữ lịch sử chat bao gồm:
    - ID tin nhắn (ObjectId)
    - ID cuộc trò chuyện
    - Câu hỏi
    - Câu trả lời
    - Thời gian tạo
    """
    db = get_db_connection()
    message_collection = db.message
    # Tạo chỉ mục cho trường thread_id (tương tự như chỉ mục trong MySQL)
    message_collection.create_index([("thread_id", 1)])

# Lưu lịch sử chat vào MongoDB
def save_chat_history(thread_id: str, question: str, answer: str) -> Dict:
    """
    Lưu lịch sử chat vào MongoDB
    
    Args:
        thread_id (str): ID của cuộc trò chuyện
        question (str): Câu hỏi của người dùng
        answer (str): Câu trả lời của chatbot
        
    Returns:
        Dict: Thông tin lịch sử chat vừa được lưu
    """
    db = get_db_connection()
    message_collection = db.message
    message = {
        "thread_id": thread_id,
        "question": question,
        "answer": answer,
        "created_at": datetime.now()
    }
    # Lưu thông tin vào collection message
    result = message_collection.insert_one(message)
    # Trả về thông tin tin nhắn vừa lưu với ObjectId
    message["_id"] = str(result.inserted_id)
    return message

# Lấy lịch sử chat gần đây từ MongoDB
def get_recent_chat_history(thread_id: str, limit: int = 10) -> List[Dict]:
    """
    Lấy lịch sử chat gần đây của một cuộc trò chuyện
    
    Args:
        thread_id (str): ID của cuộc trò chuyện
        limit (int): Số lượng tin nhắn tối đa cần lấy, mặc định là 10
        
    Returns:
        List[Dict]: Danh sách các tin nhắn gần đây
    """
    db = get_db_connection()
    message_collection = db.message
    # Lấy lịch sử chat theo thread_id, sắp xếp theo thời gian tạo (giảm dần)
    cursor = message_collection.find({"thread_id": thread_id}) \
        .sort("created_at", -1) \
        .limit(limit)
    return [{"_id": str(msg["_id"]), "thread_id": msg["thread_id"], "question": msg["question"], 
             "answer": msg["answer"], "created_at": msg["created_at"]} for msg in cursor]

# Định dạng lịch sử chat thành chuỗi văn bản
def format_chat_history(chat_history: List[Dict]) -> List[Dict]:
    """
    Định dạng lịch sử chat thành chuỗi văn bản
    
    Args:
        chat_history (List[Dict]): Danh sách các tin nhắn
        
    Returns:
        List[Dict]: Danh sách định dạng lại dưới dạng "role" và "content"
    """
    formatted_history = []
    for msg in reversed(chat_history):  # Reverse to get chronological order
        formatted_history.extend([{
            "role": "human", "content": msg["question"]
        }, {
            "role": "assistant", "content": msg["answer"]
        }])
    return formatted_history

# Khởi tạo collection khi module được import
init_chat_history_collection()
