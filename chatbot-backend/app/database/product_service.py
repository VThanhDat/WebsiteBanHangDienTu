import os
from dotenv import load_dotenv
from pymongo import MongoClient
from decimal import Decimal
from typing import List, Dict, Optional
from bson import ObjectId
from datetime import datetime
import re


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

# Khởi tạo collection products trong MongoDB
def init_product_collection():
    """
    Khởi tạo collection products trong MongoDB nếu chưa tồn tại
    """
    db = get_db_connection()
    product_collection = db.products
    # Tạo chỉ mục cho trường title và slug để tối ưu hóa tìm kiếm
    product_collection.create_index([("title", 1)])
    product_collection.create_index([("slug", 1)], unique=True)

# Lấy thông tin sản phẩm theo tên
def get_product_by_title(title: str) -> Optional[Dict]:
    """
    Tìm kiếm sản phẩm theo tiêu đề
    
    Args:
        title (str): Tiêu đề sản phẩm cần tìm
        
    Returns:
        Optional[Dict]: Thông tin sản phẩm nếu tìm thấy, None nếu không tìm thấy
    """
    db = get_db_connection()

    escaped_title = re.escape(title)
    product = db.products.find_one({"title": {"$regex": escaped_title, "$options": "i"}})
    
    if product:
        for key in ["_id", "brand", "category"]:
            if key in product:
                product[key] = str(product[key])
        if "price" in product:
            product["price"] = Decimal(str(product["price"]))
        return product
    return None

# Lấy sản phẩm theo slug
def get_product_by_slug(slug: str) -> Optional[Dict]:
    """
    Tìm kiếm sản phẩm theo slug
    
    Args:
        slug (str): Slug của sản phẩm cần tìm
        
    Returns:
        Optional[Dict]: Thông tin sản phẩm nếu tìm thấy, None nếu không tìm thấy
    """
    db = get_db_connection()
    product_collection = db.products
    product = product_collection.find_one({"slug": slug})
    
    if product:
        product["_id"] = str(product["_id"])
        if "brand" in product:
            product["brand"] = str(product["brand"])
        if "category" in product:
            product["category"] = str(product["category"])
        product["price"] = Decimal(str(product["price"]))
        return product
    return None

# Kiểm tra số lượng tồn kho của sản phẩm
def check_product_stock(product_id: str, quantity: int) -> bool:
    """
    Kiểm tra số lượng tồn kho của sản phẩm
    
    Args:
        product_id (str): ID của sản phẩm
        quantity (int): Số lượng cần kiểm tra
        
    Returns:
        bool: True nếu đủ số lượng, False nếu không đủ
    """
    db = get_db_connection()
    product_collection = db.products

    # Chuyển product_id thành ObjectId nếu cần
    try:
        product_id = ObjectId(product_id)
    except Exception as e:
        raise ValueError(f"Invalid product_id: {product_id}. Must be a valid ObjectId.") from e

    product = product_collection.find_one({"_id": product_id})

    if product and product.get("quantity", 0) >= quantity:  # Sử dụng quantity thay vì stock
        return True
    return False

# Cập nhật số lượng tồn kho của sản phẩm
def update_product_stock(product_id: str, quantity: int) -> bool:
    """
    Cập nhật số lượng tồn kho của sản phẩm
    
    Args:
        product_id (str): ID của sản phẩm
        quantity (int): Số lượng cần trừ đi (số âm để thêm vào)
        
    Returns:
        bool: True nếu cập nhật thành công, False nếu thất bại
    """
    db = get_db_connection()
    product_collection = db.products

    # Chuyển product_id thành ObjectId
    try:
        product_id = ObjectId(product_id)
    except Exception as e:
        raise ValueError(f"Invalid product_id: {product_id}. Must be a valid ObjectId.") from e

    result = product_collection.update_one(
        {"_id": product_id, "quantity": {"$gte": quantity}},  # Sử dụng quantity thay vì stock
        {"$inc": {"quantity": -quantity, "sold": quantity}, "$set": {"updatedAt": datetime.now()}}  # Cập nhật updatedAt thay vì updated_at
    )
    return result.matched_count > 0

# Lấy tất cả sản phẩm
def get_all_products() -> List[Dict]:
    """
    Lấy tất cả sản phẩm trong collection products
    
    Returns:
        List[Dict]: Danh sách các sản phẩm
    """
    db = get_db_connection()
    product_collection = db.products
    products = product_collection.find()
    
    result = []
    for product in products:
        product["_id"] = str(product["_id"])  # Chuyển ObjectId thành chuỗi
        # Chuyển các ObjectId khác thành chuỗi
        if "brand" in product:
            product["brand"] = str(product["brand"])
        if "category" in product:
            product["category"] = str(product["category"])
        product["price"] = Decimal(str(product["price"]))  # Đảm bảo giá là Decimal
        result.append(product)
    
    return result

# So sánh các sản phẩm dựa trên danh sách ID
def compare_products(product_ids: List[str]) -> List[Dict]:
    """
    So sánh các sản phẩm dựa trên danh sách ID sản phẩm.

    Args:
        product_ids (List[str]): Danh sách ID của các sản phẩm cần so sánh.

    Returns:
        List[Dict]: Danh sách thông tin các sản phẩm để so sánh.
    """
    if not product_ids or len(product_ids) < 2:
        raise ValueError("Cần ít nhất hai sản phẩm để so sánh.")

    db = get_db_connection()
    product_collection = db.products
    products = product_collection.find({"_id": {"$in": [ObjectId(pid) for pid in product_ids]}})

    result = []
    for product in products:
        product["_id"] = str(product["_id"])
        # Chuyển các ObjectId khác thành chuỗi
        if "brand" in product:
            product["brand"] = str(product["brand"])
        if "category" in product:
            product["category"] = str(product["category"])
        product["price"] = Decimal(str(product["price"]))
        result.append(product)

    return result

# Lấy danh sách sản phẩm có giá nhỏ hơn hoặc bằng ngân sách
def get_products_within_budget(budget: Decimal) -> List[Dict]:
    """
    Lấy danh sách sản phẩm có giá nhỏ hơn hoặc bằng ngân sách.

    Args:
        budget (Decimal): Số tiền tối đa mà người dùng có thể chi tiêu.

    Returns:
        List[Dict]: Danh sách các sản phẩm phù hợp.
    """
    db = get_db_connection()
    product_collection = db.products
    products = product_collection.find({"price": {"$lte": float(budget)}})

    result = []
    for product in products:
        product["_id"] = str(product["_id"])
        # Chuyển các ObjectId khác thành chuỗi
        if "brand" in product:
            product["brand"] = str(product["brand"])
        if "category" in product:
            product["category"] = str(product["category"])
        product["price"] = Decimal(str(product["price"]))
        result.append(product)

    return result