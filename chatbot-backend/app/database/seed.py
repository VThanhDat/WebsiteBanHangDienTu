from typing import List, Dict
from app.database.chat_history_service import get_db_connection
import json
from app.database.product_service import init_product_collection, get_product_by_title, get_product_by_slug
from app.database.order_service import init_order_collection
from app.database.coupon_service import init_coupon_collection
from app.database.user_service import init_user_collection
from decimal import Decimal
from bson import ObjectId
from datetime import datetime

SAMPLE_PRODUCTS = []

SAMPLE_USER = []

SAMPLE_COUPON = []

# Hàm chèn sản phẩm vào MongoDB
def seed_products():
    """Seed products into database"""
    db = get_db_connection()
    product_collection = db.products

    # Xóa dữ liệu cũ trong collection
    product_collection.delete_many({})

    # Chuyển đổi ObjectId từ dict nếu cần
    def convert_object_ids(obj):
        if isinstance(obj, dict):
            if "$oid" in obj:
                return ObjectId(obj["$oid"])
            else:
                return {k: convert_object_ids(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_object_ids(i) for i in obj]
        else:
            return obj

    # Chèn dữ liệu mới
    converted_products = [convert_object_ids(product) for product in SAMPLE_PRODUCTS]
    product_collection.insert_many(converted_products)

    print("Product seeding completed.")
    
    # Hàm chèn mã giảm giá vào MongoDB
    
def seed_coupons():
    """Seed coupons into database"""
    db = get_db_connection()
    coupon_collection = db.coupons

    # Xóa dữ liệu cũ trong collection
    coupon_collection.delete_many({})

    # Chuyển đổi ObjectId và datetime từ dict
    def convert_object_ids(obj):
        if isinstance(obj, dict):
            if "$oid" in obj:
                return ObjectId(obj["$oid"])
            elif "$date" in obj:
                return datetime.fromisoformat(obj["$date"].replace('Z', '+00:00'))
            else:
                return {k: convert_object_ids(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_object_ids(i) for i in obj]
        else:
            return obj

    # Chèn dữ liệu mới
    converted_coupons = [convert_object_ids(coupon) for coupon in SAMPLE_COUPON]
    coupon_collection.insert_many(converted_coupons)

    print("Coupon seeding completed.")

# Hàm chèn người dùng vào MongoDB
def seed_users():
    """Seed users into database"""
    db = get_db_connection()
    user_collection = db.users

    # Xóa dữ liệu cũ trong collection
    user_collection.delete_many({})

    # Chuyển đổi ObjectId và datetime từ dict
    def convert_object_ids(obj):
        if isinstance(obj, dict):
            if "$oid" in obj:
                return ObjectId(obj["$oid"])
            elif "$date" in obj:
                return datetime.fromisoformat(obj["$date"].replace('Z', '+00:00'))
            else:
                return {k: convert_object_ids(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_object_ids(i) for i in obj]
        else:
            return obj

    # Chèn dữ liệu mới
    converted_users = [convert_object_ids(user) for user in SAMPLE_USER]
    user_collection.insert_many(converted_users)

    print("User seeding completed.")
    
def init_and_seed_database():
    """Initialize tables and seed data"""
    print("Initializing tables...")
    init_product_collection()
    init_order_collection()
    init_coupon_collection()
    init_user_collection()
    
    print("Seeding products...")
    seed_products()
    seed_coupons()
    seed_users()
    
    print("Database initialization and seeding completed!")

if __name__ == "__main__":
    init_and_seed_database()