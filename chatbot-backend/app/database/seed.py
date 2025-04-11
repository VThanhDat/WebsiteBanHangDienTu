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

SAMPLE_PRODUCTS = [
  {
  "_id": {
    "$oid": "679b0c24d5d5ff1d155f7616"
  },
  "title": "MOTOROLA MOTO 360 (2ND GEN)",
  "slug": "motorola-moto-360-(2nd-gen)_12213",
  "description": [
    "Technology: No cellular connectivity",
    "Dimensions: 46 x 46 x 11.4 mm",
    "Weight: IPS LCD g",
    "Display: AMOLED 1.56 inches",
    "Resolution: 360 x 330",
    "OS: Android Wear OS",
    "Chipset: Snapdragon 400",
    "CPU: Quad-core 1.2 GHz Cortex-A7",
    "Internal: 4 GB, 512 MB RAM",
    "Camera: No"
  ],
  "brand": {
    "$oid": "6780df1812d1846686e03ed3"
  },
  "thumb": "https://cdn.shopify.com/s/files/1/1903/4853/products/Untitled-189_1024x1024.jpg?v=1491404918",
  "price": 8255046,
  "category": {
    "$oid": "6780df2812d1846686e03f01"
  },
  "quantity": 40,
  "sold": 28,
  "images": [
    "https://cdn.shopify.com/s/files/1/1903/4853/products/Untitled-189_1024x1024.jpg?v=1491404918",
    "https://cdn.shopify.com/s/files/1/1903/4853/products/motorola-moto-360-2015-1_1024x1024.jpg?v=1491404918",
    "https://cdn.shopify.com/s/files/1/1903/4853/products/motorola-moto-360-2015-2_1024x1024.jpg?v=1491404918",
    "https://cdn.shopify.com/s/files/1/1903/4853/products/motorola-moto-360-2015-3_1024x1024.jpg?v=1491404918",
    "https://cdn.shopify.com/s/files/1/1903/4853/products/motorola-moto-360-2015-4_1024x1024.jpg?v=1491404918"
  ],
  "variants": [
    {
      "label": "Color",
      "variants": [
        {
          "variant": "BLACK LEATHER",
          "quantity": 10,
          "_id": {
            "$oid": "679b0c24d5d5ff1d155f7618"
          }
        },
        {
          "variant": "BLACK METAL",
          "quantity": 10,
          "_id": {
            "$oid": "679b0c24d5d5ff1d155f7619"
          }
        },
        {
          "variant": "ROSE GOLD",
          "quantity": 10,
          "_id": {
            "$oid": "679b0c24d5d5ff1d155f761a"
          }
        },
        {
          "variant": "SILVER",
          "quantity": 10,
          "_id": {
            "$oid": "679b0c24d5d5ff1d155f761b"
          }
        }
      ],
      "_id": {
        "$oid": "679b0c24d5d5ff1d155f7617"
      }
    },
    {
      "label": "Traps",
      "variants": [
        {
          "variant": "42MM",
          "quantity": 10,
          "_id": {
            "$oid": "679b0c24d5d5ff1d155f761d"
          }
        },
        {
          "variant": "46MM",
          "quantity": 10,
          "_id": {
            "$oid": "679b0c24d5d5ff1d155f761e"
          }
        }
      ],
      "_id": {
        "$oid": "679b0c24d5d5ff1d155f761c"
      }
    }
  ],
  "totalRatings": 0,
  "ratings": [],
  "createdAt": {
    "$date": "2025-01-30T05:20:36.516Z"
  },
  "updatedAt": {
    "$date": "2025-01-30T05:20:36.516Z"
  },
  "__v": 0
},
{
  "_id": {
    "$oid": "679b0c24d5d5ff1d155f7620"
  },
  "title": "LOGITECH MX ANYWHERE 2",
  "slug": "logitech-mx-anywhere-2_96539",
  "description": [
    "Technology: USB port or Bluetooth",
    "Dimensions: 61.6 x 100.3 x 1.4 mm",
    "Weight: 106 g",
    "Battery life: up to 2 month",
    "Battery: rechargeable Li-Po (500 mAh)",
    "Wireless distance: 32 ft (10 m)",
    "Wireless technology: 2.4GHz",
    "Sensor: Darkfield Laser sensor",
    "1-Year Limited Hardware Warranty",
    "Requirements: Windows® 7 to latest"
  ],
  "brand": {
    "$oid": "6780df1812d1846686e03ed0"
  },
  "thumb": "https://cdn.shopify.com/s/files/1/1903/4853/products/z1_377a4aa6-df39-466b-8234-d7c2f6f4ca1a_1024x1024.jpg?v=1491404814",
  "price": 424321,
  "category": {
    "$oid": "6780df2812d1846686e03f01"
  },
  "quantity": 30,
  "sold": 47,
  "images": [
    "https://cdn.shopify.com/s/files/1/1903/4853/products/z3_5229b270-7b1c-4b40-8100-204f96c43f88_1024x1024.jpg?v=1491404814",
    "https://cdn.shopify.com/s/files/1/1903/4853/products/z1_377a4aa6-df39-466b-8234-d7c2f6f4ca1a_1024x1024.jpg?v=1491404814",
    "https://cdn.shopify.com/s/files/1/1903/4853/products/z2_2ca9a51c-540d-4bbc-8be1-88dc83ccefa1_1024x1024.jpg?v=1491404814"
  ],
  "variants": [
    {
      "label": "Color",
      "variants": [
        {
          "variant": "BLACK",
          "quantity": 10,
          "_id": {
            "$oid": "679b0c24d5d5ff1d155f7622"
          }
        },
        {
          "variant": "NAVY BLUE",
          "quantity": 10,
          "_id": {
            "$oid": "679b0c24d5d5ff1d155f7623"
          }
        },
        {
          "variant": "STONE",
          "quantity": 10,
          "_id": {
            "$oid": "679b0c24d5d5ff1d155f7624"
          }
        }
      ],
      "_id": {
        "$oid": "679b0c24d5d5ff1d155f7621"
      }
    }
  ],
  "totalRatings": 0,
  "ratings": [],
  "createdAt": {
    "$date": "2025-01-30T05:20:36.516Z"
  },
  "updatedAt": {
    "$date": "2025-01-30T05:20:36.516Z"
  },
  "__v": 0
},
]

SAMPLE_USER = [{
  "_id": {
    "$oid": "6780cbe5f1ded60bba7e9735"
  },
  "email": "thanhdat@gmail.com",
  "phone": "01231456",
  "password": "$2b$10$.qr6jlkTsHz8bAtzA2MyF.iV347WbYxUYLmM.jTcXixBdS/fUV2vi",
  "role": "user",
  "isBlocked": False,
  "createdAt": {
    "$date": "2025-01-10T07:27:33.321Z"
  },
  "updatedAt": {
    "$date": "2025-04-10T12:12:54.317Z"
  },
  "__v": 0,
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzgwY2JlNWYxZGVkNjBiYmE3ZTk3MzUiLCJpYXQiOjE3NDQyODcxNzQsImV4cCI6MTc0NDg5MTk3NH0.ALXPbIkm5x7F9oyk4ZHEKBs56ftlWUgI-zTn6pWtSpg",
  "firstName": "firstname1",
  "lastName": "lastname1",
  "address": [
    "Ninh Kieu, Can Tho",
    "Kien Giang"
  ]
},
{
  "_id": {
    "$oid": "6780ccc7f1ded60bba7e973e"
  },
  "email": "thanhdat2@gmail.com",
  "phone": "012314587",
  "password": "$2b$10$r46VuuVP20ZIrUOrkY17eepK.eNBeHtoi3KIBiM1i6qRhKP9IkXh6",
  "role": "user",
  "isBlocked": False,
  "createdAt": {
    "$date": "2025-01-10T07:31:19.077Z"
  },
  "updatedAt": {
    "$date": "2025-04-10T08:55:14.936Z"
  },
  "__v": 1,
  "firstName": "Thành",
  "lastName": "Đạt",
  "address": [
    "Tran Van Kiet, Quan 7,Ho Chi Minh",
    "Duong 3/2,Hung Loi,Can Tho"
  ],
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzgwY2NjN2YxZGVkNjBiYmE3ZTk3M2UiLCJpYXQiOjE3NDQyNzQyNzAsImV4cCI6MTc0NDg3OTA3MH0.jLxAFvrUv12G3pCjOTVg2XRSsVhKBSKhvD869_3yBNg",
  "passwordChangedAt": "Wed Mar 12 2025 14:06:13 GMT+0700 (Giờ Đông Dương)"
}]

SAMPLE_COUPON = [{
  "_id": {
    "$oid": "67cb3125c7b881c17b889f85"
  },
  "title": "WELCOME50",
  "discount": 50,
  "expiry": {
    "$date": "2025-05-25T00:30:00.000Z"
  },
  "createdAt": {
    "$date": "2025-03-07T17:47:17.763Z"
  },
  "updatedAt": {
    "$date": "2025-03-09T12:50:43.385Z"
  },
  "__v": 0
},
{
  "_id": {
    "$oid": "67cd8e20881ba8b93230ac08"
  },
  "title": "TEST10",
  "discount": 10,
  "expiry": {
    "$date": "2025-05-02T14:45:00.000Z"
  },
  "createdAt": {
    "$date": "2025-03-09T12:48:32.123Z"
  },
  "updatedAt": {
    "$date": "2025-03-28T14:37:16.008Z"
  },
  "__v": 0
}]

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