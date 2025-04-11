from langchain.tools import BaseTool
from pydantic import BaseModel, Field
from typing import Optional, Dict, Annotated, List, Union
from app.database.product_service import (
    get_product_by_title,
    get_product_by_slug,
    update_product_stock,
    check_product_stock,
    get_all_products,
    get_products_within_budget,
)
from app.database.order_service import create_order
from app.database.user_service import get_user_by_id
from app.database.coupon_service import get_coupon_by_id
from bson import ObjectId
from decimal import Decimal
from datetime import datetime
import asyncio

# Input schema for searching products
class ProductSearchInput(BaseModel):
    product_name: Optional[str] = Field(None, description="The name of the product to search for (optional)")
    budget: Optional[float] = Field(None, description="The budget to filter products by (optional)")

class ProductSearchTool(BaseTool):
    name: Annotated[str, Field(description="Tool name")] = "product_search"
    description: Annotated[str, Field(description="Tool description")] = (
        "Search for product information by name, retrieve products within a budget, or get all products."
    )
    args_schema: type[BaseModel] = ProductSearchInput

    def _run(self, product_name: Optional[str] = None, budget: Optional[float] = None) -> List[Dict]:
        if budget is not None:
            return get_products_within_budget(budget)
        elif product_name:
            product = get_product_by_title(product_name)
            return [product] if product else []
        else:
            return get_all_products()

    async def _arun(self, product_name: Optional[str] = None, budget: Optional[float] = None) -> List[Dict]:
        if budget is not None:
            return await asyncio.to_thread(get_products_within_budget, budget)
        elif product_name:
            product = await asyncio.to_thread(get_product_by_title, product_name)
            return [product] if product else []
        else:
            return await asyncio.to_thread(get_all_products)

# Input schema for creating orders
class CreateOrderInput(BaseModel):
    user_id: Union[str, None] = Field(None, description="The ID of the user placing the order")
    products: List[Dict] = Field(
        ...,
        description="List of products with their quantities and variants. Each product dict should contain 'slug' (str), 'quantity' (int), and optional 'variant' (list of {'label': str, 'variant': str})",
    )
    total: float = Field(..., description="The total amount of the order")
    address: str = Field(..., description="Delivery address")
    phone: str = Field(..., description="Contact phone number")
    payment_method: str = Field(..., description="Payment method")
    coupon: Optional[str] = Field(None, description="Coupon ID if applicable")

# # Tool for creating orders
class CreateOrderTool(BaseTool):
    name: Annotated[str, Field(description="Tool name")] = "create_order"
    description: Annotated[str, Field(description="Tool description")] = (
        "Create a new order for multiple products with optional coupon and delivery details."
    )
    args_schema: type[BaseModel] = CreateOrderInput

    def _run(
        self,
        user_id: str,
        products: List[Dict],
        total: float,
        address: str,
        phone: str,
        payment_method: str,
        coupon: Optional[str] = None,
    ) -> Dict:
        # Nếu không có user_id → báo cần đăng nhập
        if not user_id:
            return {
                "error": "unauthorized",
                "message": "Bạn cần đăng nhập để đặt hàng. Vui lòng đăng nhập tại http://localhost:3000/login"
            }
        
        # Validate user
        user = get_user_by_id(user_id)
        if not user:
            return {
                "error": "user_not_found",
                "message": "Không tìm thấy người dùng. Vui lòng đăng nhập lại tại http://localhost:3000/login"
            }

        if user.get("isBlocked", False):
            return {
                "error": "user_blocked",
                "message": "Tài khoản của bạn đã bị khóa và không thể đặt hàng."
            }

        # Validate products and stock
        order_products = []
        calculated_total = Decimal("0")
        for product_item in products:
            slug = product_item.get("slug")
            quantity = product_item.get("quantity")
            variant = product_item.get("variant")

            if not slug or not quantity:
                return {
                    "error": "Invalid product data",
                    "message": "Each product must have a slug and quantity",
                }

            # Check if product exists
            product = get_product_by_slug(slug)
            if not product:
                return {
                    "error": "Product not found",
                    "message": f"Product with slug {slug} does not exist",
                }

            # Check stock (assuming check_product_stock accepts product_id)
            product_id = product["_id"]
            if not check_product_stock(product_id, quantity):
                return {
                    "error": "Insufficient stock",
                    "message": f"Product {product['title']} is out of stock or has insufficient quantity",
                }

            # Validate variants if provided
            if variant:
                valid_variants = self._validate_variants(product, variant)
                if not valid_variants:
                    return {
                        "error": "Invalid variant",
                        "message": f"Invalid variant selection for product {product['title']}",
                    }

            # Calculate price
            product_price = Decimal(str(product["price"]))
            calculated_total += product_price * quantity

            order_products.append(
                {
                    "product": ObjectId(product_id),
                    "quantity": quantity,
                    "variant": variant if variant else None,
                }
            )

        # Validate coupon if provided
        coupon_id = None
        if coupon:
            coupon_data = get_coupon_by_id(coupon)
            if not coupon_data:
                return {"error": "Invalid coupon", "message": "Coupon does not exist"}
            if coupon_data["expiry"] < datetime.now():
                return {"error": "Expired coupon", "message": "Coupon has expired"}
            coupon_id = ObjectId(coupon)
            calculated_total -= Decimal(str(coupon_data["discount"]))

        # Validate total
        if abs(calculated_total - Decimal(str(total))) > Decimal("0.01"):
            return {
                "error": "Invalid total",
                "message": f"Provided total ({total}) does not match calculated total ({calculated_total})",
            }

        # Update stock for all products
        for product_item in products:
            slug = product_item["slug"]
            quantity = product_item["quantity"]
            product = get_product_by_slug(slug)
            product_id = product["_id"]
            if not update_product_stock(product_id, quantity):
                # Rollback stock updates if any fail
                for prev_item in products[:products.index(product_item)]:
                    prev_product = get_product_by_slug(prev_item["slug"])
                    update_product_stock(prev_product["_id"], -prev_item["quantity"])
                return {
                    "error": "Stock update failed",
                    "message": f"Failed to update stock for product {slug}",
                }

        # Create order
        order_data = {
            "products": order_products,
            "status": "Pending",
            "total": float(calculated_total),
            "coupon": coupon_id,
            "address": address,
            "phone": phone,
            "paymentMethod": payment_method,
            "orderBy": ObjectId(user_id),
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
        }

        order = create_order(order_data)
        if not order:
            # Rollback stock updates
            for product_item in products:
                product = get_product_by_slug(product_item["slug"])
                update_product_stock(product["_id"], -product_item["quantity"])
            return {"error": "Order creation failed", "message": "Failed to create order"}

        return {
            "success": True,
            "order": order,
            "message": "Order created successfully",
        }

    async def _arun(
        self,
        user_id: str,
        products: List[Dict],
        total: float,
        address: str,
        phone: str,
        payment_method: str,
        coupon: Optional[str] = None,
    ) -> Dict:
        return await asyncio.to_thread(
            self._run, user_id, products, total, address, phone, payment_method, coupon
        )

    def _validate_variants(self, product: Dict, selected_variants: List[Dict]) -> bool:
        if not product.get("variants"):
            return not selected_variants  # No variants in product, so none should be selected

        # Chuyển tất cả variant của product về UPPER để chuẩn hóa
        product_variants = {
            vg["label"].upper(): {v["variant"].upper() for v in vg["variants"]}
            for vg in product["variants"]
        }

        for sv in selected_variants:
            label = sv.get("label", "").upper()
            variant = sv.get("variant", "").upper()

            if label not in product_variants:
                return False
            if variant not in product_variants[label]:
                return False

        return True
