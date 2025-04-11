import os
from dotenv import load_dotenv
from pymongo import MongoClient
from decimal import Decimal
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

# Khởi tạo collection orders trong MongoDB
def init_order_collection():
    """
    Khởi tạo collection orders trong MongoDB nếu chưa tồn tại
    """
    db = get_db_connection()
    order_collection = db.orders
    # Tạo chỉ mục cho trường orderBy để tối ưu hóa truy vấn
    order_collection.create_index([("orderBy", 1)])
    order_collection.create_index([("products.product", 1)])

# Tạo đơn hàng mới
def create_order(order_data: Dict[str, Any]) -> str:
    """
    Tạo đơn hàng mới
    
    Args:
        order_data (Dict[str, Any]): Dữ liệu đơn hàng bao gồm:
            - products: danh sách các sản phẩm (product, quantity, variant)
            - total: tổng tiền đơn hàng
            - address: địa chỉ giao hàng
            - phone: số điện thoại
            - paymentMethod: phương thức thanh toán
            - orderBy: ID người đặt hàng
            - coupon: ID của mã giảm giá (tùy chọn)
            
    Returns:
        str: ID của đơn hàng vừa tạo
    """
    # Chuyển các ObjectId từ chuỗi thành ObjectId
    if "orderBy" in order_data and isinstance(order_data["orderBy"], str):
        order_data["orderBy"] = ObjectId(order_data["orderBy"])
    
    if "coupon" in order_data and order_data["coupon"] and isinstance(order_data["coupon"], str):
        order_data["coupon"] = ObjectId(order_data["coupon"])
    
    # Chuyển đổi các product ID trong danh sách products
    if "products" in order_data:
        for product in order_data["products"]:
            if "product" in product and isinstance(product["product"], str):
                product["product"] = ObjectId(product["product"])
    
    # Thêm thời gian tạo và cập nhật
    current_time = datetime.now()
    order_data["created_at"] = current_time
    order_data["updated_at"] = current_time
    
    # Đặt trạng thái mặc định nếu không có
    if "status" not in order_data:
        order_data["status"] = "Pending"
    
    # Chèn đơn hàng vào MongoDB
    db = get_db_connection()
    order_collection = db.orders
    result = order_collection.insert_one(order_data)
    
    return str(result.inserted_id)

# Lấy thông tin đơn hàng theo ID
def get_order_by_id(order_id: str) -> Optional[Dict]:
    """
    Lấy thông tin đơn hàng theo ID
    
    Args:
        order_id (str): ID của đơn hàng
        
    Returns:
        Optional[Dict]: Thông tin đơn hàng nếu tìm thấy, None nếu không tìm thấy
    """
    db = get_db_connection()
    order_collection = db.orders
    order = order_collection.find_one({"_id": ObjectId(order_id)})
    
    if order:
        # Chuyển ObjectId thành chuỗi để dễ xử lý ở phía client
        order["_id"] = str(order["_id"])
        
        if "orderBy" in order:
            order["orderBy"] = str(order["orderBy"])
        
        if "coupon" in order and order["coupon"]:
            order["coupon"] = str(order["coupon"])
        
        # Chuyển đổi các product ID trong danh sách products
        if "products" in order:
            for product in order["products"]:
                if "product" in product:
                    product["product"] = str(product["product"])
        
        return order
    return None

# Lấy tất cả đơn hàng của người dùng
def get_orders_by_user(user_id: str) -> List[Dict]:
    """
    Lấy tất cả đơn hàng của người dùng theo user_id
    
    Args:
        user_id (str): ID của người dùng
        
    Returns:
        List[Dict]: Danh sách các đơn hàng của người dùng
    """
    db = get_db_connection()
    order_collection = db.orders
    
    # Chuyển user_id thành ObjectId nếu cần
    try:
        user_id_obj = ObjectId(user_id)
    except Exception as e:
        raise ValueError(f"Invalid user_id: {user_id}. Must be a valid ObjectId.") from e
    
    orders = order_collection.find({"orderBy": user_id_obj})
    
    result = []
    for order in orders:
        # Chuyển ObjectId thành chuỗi để dễ xử lý ở phía client
        order["_id"] = str(order["_id"])
        
        if "orderBy" in order:
            order["orderBy"] = str(order["orderBy"])
        
        if "coupon" in order and order["coupon"]:
            order["coupon"] = str(order["coupon"])
        
        # Chuyển đổi các product ID trong danh sách products
        if "products" in order:
            for product in order["products"]:
                if "product" in product:
                    product["product"] = str(product["product"])
        
        result.append(order)
    
    return result

# Thêm hoàn tiền cho đơn hàng (ví dụ khi hủy đơn hàng)
def refund_order(order_id: str) -> bool:
    """
    Đánh dấu một đơn hàng đã được hoàn tiền
    
    Args:
        order_id (str): ID của đơn hàng
        
    Returns:
        bool: True nếu hoàn tiền thành công, False nếu thất bại
    """
    db = get_db_connection()
    order_collection = db.orders
    result = order_collection.update_one(
        {"_id": ObjectId(order_id)}, 
        {"$set": {"status": "Cancelled", "refunded": True, "updated_at": datetime.now()}}
    )
    
    return result.matched_count == 1

# Khởi tạo collection khi module được import
init_order_collection()