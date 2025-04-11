import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime
from typing import List, Dict, Optional, Any
from bson import ObjectId
from pydantic import EmailStr
from fastapi import HTTPException

# Tải thông tin từ .env
load_dotenv()

DB_NAME = os.getenv('DB_NAME')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = int(os.getenv('DB_PORT', 27017))  # Default MongoDB port

# Kết nối đến MongoDB
def get_db_connection():
    """
    Create a connection to the MongoDB database
    
    Returns:
        db: MongoDB database object
    """
    client = MongoClient(DB_HOST, DB_PORT)
    return client[DB_NAME]

# Khởi tạo collection users trong MongoDB
def init_user_collection():
    """
    Initialize the users collection in MongoDB if it doesn't exist
    """
    db = get_db_connection()
    user_collection = db.users
    # Create index for email to optimize queries and ensure uniqueness
    user_collection.create_index([("email", 1)], unique=True)

# Tạo người dùng mới
def create_user(user_data: Dict[str, Any]) -> str:
    """
    Create a new user
    
    Args:
        user_data (Dict[str, Any]): User data including:
            - firstName: First name
            - lastName: Last name
            - email: User email
            - phone: Phone number
            - password: Password
            - role: User role (optional, defaults to "user")
            - address: List of addresses (optional)
            - isBlocked: Block status (optional, defaults to False)
            
    Returns:
        str: ID of the newly created user
    """
    # Set default values if not provided
    user_data.setdefault("role", "user")
    user_data.setdefault("address", [])
    user_data.setdefault("isBlocked", False)
    
    # Add timestamps
    current_time = datetime.now()
    user_data["createdAt"] = current_time
    user_data["updatedAt"] = current_time
    
    db = get_db_connection()
    user_collection = db.users
    
    try:
        result = user_collection.insert_one(user_data)
        return str(result.inserted_id)
    except Exception as e:
        if "duplicate key error" in str(e).lower():
            raise ValueError(f"User with email '{user_data['email']}' already exists")
        raise

# Cập nhật thông tin người dùng
def update_user(user_id: str, user_data: Dict[str, Any]) -> Optional[Dict]:
    """
    Update user information
    
    Args:
        user_id (str): ID of the user
        user_data (Dict[str, Any]): Data to update
            - firstName: First name
            - lastName: Last name
            - email: User email
            - phone: Phone number
            - password: Password
            - role: User role
            - address: List of addresses
            - isBlocked: Block status
            - refreshToken: Refresh token
            
    Returns:
        Optional[Dict]: Updated user information, None if update fails
    """
    # Update timestamp
    user_data["updatedAt"] = datetime.now()
    
    db = get_db_connection()
    user_collection = db.users
    
    try:
        result = user_collection.update_one(
            {"_id": ObjectId(user_id)}, 
            {"$set": user_data}
        )
        
        if result.matched_count == 1:
            return get_user_by_id(user_id)
        return None
    except Exception as e:
        if "duplicate key error" in str(e).lower():
            raise ValueError(f"User with email '{user_data.get('email')}' already exists")
        raise

# Lấy thông tin người dùng theo ID
def get_user_by_id(user_id: str) -> Optional[Dict]:
    """
    Get user information by ID
    
    Args:
        user_id (str): ID of the user
        
    Returns:
        Optional[Dict]: User information if found, None if not found
    """
    db = get_db_connection()
    user_collection = db.users
    
    try:
        user = user_collection.find_one({"_id": ObjectId(user_id)})
        
        if user:
            # Convert ObjectId to string for client-side handling
            user["_id"] = str(user["_id"])
            return user
        return None
    except Exception as e:
        raise ValueError(f"Invalid user_id: {user_id}. Must be a valid ObjectId.") from e

# Lấy thông tin người dùng theo email
def get_user_by_email(email: str) -> Optional[Dict]:
    """
    Get user information by email
    
    Args:
        email (str): Email of the user
        
    Returns:
        Optional[Dict]: User information if found, None if not found
    """
    db = get_db_connection()
    user_collection = db.users
    
    user = user_collection.find_one({"email": email})
    
    if user:
        # Convert ObjectId to string for client-side handling
        user["_id"] = str(user["_id"])
        return user
    return None

# Lấy tất cả người dùng
def get_all_users() -> List[Dict]:
    """
    Get all users
    
    Returns:
        List[Dict]: List of all users
    """
    db = get_db_connection()
    user_collection = db.users
    
    users = user_collection.find()
    
    result = []
    for user in users:
        # Convert ObjectId to string for client-side handling
        user["_id"] = str(user["_id"])
        result.append(user)
    
    return result

# Chặn người dùng
def block_user(user_id: str) -> Optional[Dict]:
    """
    Block a user
    
    Args:
        user_id (str): ID of the user to block
        
    Returns:
        Optional[Dict]: Updated user information, None if update fails
    """
    return update_user(user_id, {"isBlocked": True})

# Bỏ chặn người dùng
def unblock_user(user_id: str) -> Optional[Dict]:
    """
    Unblock a user
    
    Args:
        user_id (str): ID of the user to unblock
        
    Returns:
        Optional[Dict]: Updated user information, None if update fails
    """
    return update_user(user_id, {"isBlocked": False})

# Cập nhật refresh token
def update_refresh_token(user_id: str, refresh_token: Optional[str]) -> Optional[Dict]:
    """
    Update user's refresh token
    
    Args:
        user_id (str): ID of the user
        refresh_token (Optional[str]): New refresh token or None to clear
        
    Returns:
        Optional[Dict]: Updated user information, None if update fails
    """
    return update_user(user_id, {"refreshToken": refresh_token})

# Kiểm tra xem email đã tồn tại chưa
def is_email_exists(email: str) -> bool:
    """
    Check if email already exists
    
    Args:
        email (str): Email to check
        
    Returns:
        bool: True if email exists, False otherwise
    """
    return get_user_by_email(email) is not None

# Khởi tạo collection khi module được import
init_user_collection()