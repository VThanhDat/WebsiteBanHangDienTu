import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime
from typing import List, Dict, Optional, Any
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

# Khởi tạo collection coupons trong MongoDB
def init_coupon_collection():
    """
    Khởi tạo collection coupons trong MongoDB nếu chưa tồn tại
    """
    db = get_db_connection()
    coupon_collection = db.coupons
    # Tạo chỉ mục cho trường title để tối ưu hóa truy vấn và đảm bảo tính duy nhất
    coupon_collection.create_index([("title", 1)], unique=True)

# Tạo mã giảm giá mới
def create_coupon(coupon_data: Dict[str, Any]) -> str:
    """
    Tạo mã giảm giá mới
    
    Args:
        coupon_data (Dict[str, Any]): Dữ liệu mã giảm giá bao gồm:
            - title: tên mã giảm giá (sẽ được chuyển thành chữ hoa)
            - discount: giá trị giảm giá
            - expiry: ngày hết hạn
            
    Returns:
        str: ID của mã giảm giá vừa tạo
    """
    # Chuyển title thành chữ hoa
    if "title" in coupon_data:
        coupon_data["title"] = coupon_data["title"].upper()
    
    # Đảm bảo expiry là đối tượng datetime
    if "expiry" in coupon_data and isinstance(coupon_data["expiry"], str):
        try:
            coupon_data["expiry"] = datetime.fromisoformat(coupon_data["expiry"].replace('Z', '+00:00'))
        except ValueError:
            # Thử định dạng khác nếu ISO format không hoạt động
            try:
                coupon_data["expiry"] = datetime.strptime(coupon_data["expiry"], "%Y-%m-%dT%H:%M:%S.%fZ")
            except ValueError:
                raise ValueError("Invalid expiry date format")
    
    # Thêm thời gian tạo và cập nhật
    current_time = datetime.now()
    coupon_data["createdAt"] = current_time
    coupon_data["updatedAt"] = current_time
    
    # Chèn mã giảm giá vào MongoDB
    db = get_db_connection()
    coupon_collection = db.coupons
    
    try:
        result = coupon_collection.insert_one(coupon_data)
        return str(result.inserted_id)
    except Exception as e:
        if "duplicate key error" in str(e).lower():
            raise ValueError(f"Coupon with title '{coupon_data['title']}' already exists")
        raise

# Cập nhật mã giảm giá
def update_coupon(coupon_id: str, coupon_data: Dict[str, Any]) -> Optional[Dict]:
    """
    Cập nhật thông tin mã giảm giá
    
    Args:
        coupon_id (str): ID của mã giảm giá
        coupon_data (Dict[str, Any]): Dữ liệu cần cập nhật
            - title: tên mã giảm giá (sẽ được chuyển thành chữ hoa)
            - discount: giá trị giảm giá
            - expiry: ngày hết hạn
            
    Returns:
        Optional[Dict]: Thông tin mã giảm giá sau khi cập nhật, None nếu thất bại
    """
    # Chuyển title thành chữ hoa nếu có
    if "title" in coupon_data:
        coupon_data["title"] = coupon_data["title"].upper()
    
    # Đảm bảo expiry là đối tượng datetime nếu có
    if "expiry" in coupon_data and isinstance(coupon_data["expiry"], str):
        try:
            coupon_data["expiry"] = datetime.fromisoformat(coupon_data["expiry"].replace('Z', '+00:00'))
        except ValueError:
            try:
                coupon_data["expiry"] = datetime.strptime(coupon_data["expiry"], "%Y-%m-%dT%H:%M:%S.%fZ")
            except ValueError:
                raise ValueError("Invalid expiry date format")
    
    # Cập nhật thời gian sửa đổi
    coupon_data["updatedAt"] = datetime.now()
    
    db = get_db_connection()
    coupon_collection = db.coupons
    
    try:
        result = coupon_collection.update_one(
            {"_id": ObjectId(coupon_id)}, 
            {"$set": coupon_data}
        )
        
        if result.matched_count == 1:
            return get_coupon_by_id(coupon_id)
        return None
    except Exception as e:
        if "duplicate key error" in str(e).lower():
            raise ValueError(f"Coupon with title '{coupon_data['title']}' already exists")
        raise

# Lấy thông tin mã giảm giá theo ID
def get_coupon_by_id(coupon_id: str) -> Optional[Dict]:
    """
    Lấy thông tin mã giảm giá theo ID
    
    Args:
        coupon_id (str): ID của mã giảm giá
        
    Returns:
        Optional[Dict]: Thông tin mã giảm giá nếu tìm thấy, None nếu không tìm thấy
    """
    db = get_db_connection()
    coupon_collection = db.coupons
    
    try:
        coupon = coupon_collection.find_one({"_id": ObjectId(coupon_id)})
        
        if coupon:
            # Chuyển ObjectId thành chuỗi để dễ xử lý ở phía client
            coupon["_id"] = str(coupon["_id"])
            return coupon
        return None
    except Exception as e:
        raise ValueError(f"Invalid coupon_id: {coupon_id}. Must be a valid ObjectId.") from e

# Lấy thông tin mã giảm giá theo tên
def get_coupon_by_title(title: str) -> Optional[Dict]:
    """
    Lấy thông tin mã giảm giá theo tên
    
    Args:
        title (str): Tên của mã giảm giá (không phân biệt chữ hoa/thường)
        
    Returns:
        Optional[Dict]: Thông tin mã giảm giá nếu tìm thấy, None nếu không tìm thấy
    """
    db = get_db_connection()
    coupon_collection = db.coupons
    
    coupon = coupon_collection.find_one({"title": title.upper()})
    
    if coupon:
        # Chuyển ObjectId thành chuỗi để dễ xử lý ở phía client
        coupon["_id"] = str(coupon["_id"])
        return coupon
    return None

# Lấy tất cả mã giảm giá
def get_all_coupons() -> List[Dict]:
    """
    Lấy tất cả mã giảm giá
    
    Returns:
        List[Dict]: Danh sách các mã giảm giá
    """
    db = get_db_connection()
    coupon_collection = db.coupons
    
    coupons = coupon_collection.find()
    
    result = []
    for coupon in coupons:
        # Chuyển ObjectId thành chuỗi để dễ xử lý ở phía client
        coupon["_id"] = str(coupon["_id"])
        result.append(coupon)
    
    return result

# Lấy tất cả mã giảm giá còn hiệu lực
def get_valid_coupons() -> List[Dict]:
    """
    Lấy tất cả mã giảm giá còn hiệu lực (chưa hết hạn)
    
    Returns:
        List[Dict]: Danh sách các mã giảm giá còn hiệu lực
    """
    db = get_db_connection()
    coupon_collection = db.coupons
    
    current_time = datetime.now()
    coupons = coupon_collection.find({"expiry": {"$gt": current_time}})
    
    result = []
    for coupon in coupons:
        # Chuyển ObjectId thành chuỗi để dễ xử lý ở phía client
        coupon["_id"] = str(coupon["_id"])
        result.append(coupon)
    
    return result

# Kiểm tra tính hợp lệ của mã giảm giá
def is_valid_coupon(title: str) -> Dict[str, Any]:
    """
    Kiểm tra tính hợp lệ của mã giảm giá
    
    Args:
        title (str): Tên của mã giảm giá
        
    Returns:
        Dict[str, Any]: Kết quả kiểm tra bao gồm:
            - valid (bool): True nếu mã giảm giá hợp lệ, False nếu không
            - message (str): Thông báo lỗi hoặc thông báo thành công
            - coupon (Dict, optional): Thông tin mã giảm giá nếu hợp lệ
            - discount (float, optional): Giá trị giảm giá nếu hợp lệ
    """
    db = get_db_connection()
    coupon_collection = db.coupons
    
    coupon = coupon_collection.find_one({"title": title.upper()})
    
    if not coupon:
        return {
            "valid": False,
            "message": "Mã giảm giá không tồn tại"
        }
    
    current_time = datetime.now()
    if coupon["expiry"] < current_time:
        return {
            "valid": False,
            "message": "Mã giảm giá đã hết hạn"
        }
    
    # Chuyển ObjectId thành chuỗi để dễ xử lý ở phía client
    coupon["_id"] = str(coupon["_id"])
    
    return {
        "valid": True,
        "message": "Mã giảm giá hợp lệ",
        "coupon": coupon,
        "discount": coupon["discount"]
    }
    

# Khởi tạo collection khi module được import
init_coupon_collection()