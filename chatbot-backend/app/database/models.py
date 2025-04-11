from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional, List, Any
from decimal import Decimal
from bson import ObjectId
from enum import Enum

# Custom type to handle MongoDB ObjectId
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# Model for ChatHistory
class ChatHistory(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    thread_id: str
    question: str
    answer: str
    created_at: datetime = Field(default_factory=datetime.now)

# Model for Product
class Variant(BaseModel):
    variant: str
    quantity: int = 0

class VariantGroup(BaseModel):
    label: str
    variants: List[Variant]

class Rating(BaseModel):
    star: float
    postedBy: PyObjectId
    comment: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.now)
    updatedAt: Optional[datetime] = None

class Product(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    slug: str
    description: List[Any]  # Array in MongoDB
    brand: PyObjectId
    thumb: Optional[str] = None
    price: Decimal
    category: PyObjectId
    quantity: int = 0
    sold: int = 0
    images: Optional[List[Any]] = None
    variants: Optional[List[VariantGroup]] = None
    ratings: Optional[List[Rating]] = None
    totalRatings: float = 0
    url_product: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now, alias="createdAt")
    updated_at: datetime = Field(default_factory=datetime.now, alias="updatedAt")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }

# Model for Order
class OrderStatus(str, Enum):
    CANCELLED = "Cancelled"
    PAID = "Paid"
    DELIVERING = "Delivering"
    WAITING = "Waiting"
    PENDING = "Pending"
    DELIVERED = "Delivered"

class VariantChoice(BaseModel):
    label: str
    variant: str

class OrderProduct(BaseModel):
    product: PyObjectId
    quantity: int
    variant: Optional[List[VariantChoice]] = None

class Order(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    products: List[OrderProduct]
    status: OrderStatus = OrderStatus.PENDING
    total: float
    coupon: Optional[PyObjectId] = None
    address: str
    phone: str
    paymentMethod: str
    orderBy: PyObjectId
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }

# Model for Coupon
class Coupon(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    discount: float
    expiry: datetime
    created_at: datetime = Field(default_factory=datetime.now, alias="createdAt")
    updated_at: datetime = Field(default_factory=datetime.now, alias="updatedAt")
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }

# Model for User
class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    firstName: str
    lastName: str
    email: str  # You can use EmailStr from pydantic for validation
    phone: str
    password: str
    role: str = "user"  # default value
    address: List[str] = []  # default empty list
    isBlocked: bool = False
    refreshToken: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now, alias="createdAt")
    updated_at: datetime = Field(default_factory=datetime.now, alias="updatedAt")
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }