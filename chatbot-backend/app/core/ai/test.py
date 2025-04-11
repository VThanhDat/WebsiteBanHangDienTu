# from unittest.mock import patch, MagicMock
# from bson import ObjectId
# from datetime import datetime
# from decimal import Decimal
# from app.core.ai.tools import CreateOrderTool

# @patch("app.core.ai.tools.get_user_by_id")
# @patch("app.core.ai.tools.get_product_by_slug")
# @patch("app.core.ai.tools.check_product_stock")
# @patch("app.core.ai.tools.update_product_stock")
# @patch("app.core.ai.tools.create_order")
# def test_create_order_success(
#     mock_create_order,
#     mock_update_stock,
#     mock_check_stock,
#     mock_get_product_by_slug,
#     mock_get_user
# ):
#     # Mock return data
#     mock_get_user.return_value = {"_id": "6780cbe5f1ded60bba7e9735", "isBlocked": False}
    
#     product_id = ObjectId("6613a9bdb5982e7921123abc")
#     mock_get_product_by_slug.return_value = {
#         "_id": product_id,
#         "title": "MOTOROLA MOTO 360 (2ND GEN)",
#         "slug": "motorola-moto-360-(2nd-gen)_12213",
#         "price": 8255046,
#         "variants": [
#             {
#                 "label": "Color",
#                 "variants": [{"variant": "Black"}, {"variant": "Silver"}]
#             }
#         ]
#     }
    
#     mock_check_stock.return_value = True
#     mock_update_stock.return_value = True
#     mock_create_order.return_value = {"_id": "ORDER_ID_TEST", "status": "Pending"}
    
#     # Create and run tool
#     tool = CreateOrderTool()
#     result = tool._run(
#         user_id="6780cbe5f1ded60bba7e9735",
#         products=[{
#             "slug": "motorola-moto-360-(2nd-gen)_12213",
#             "quantity": 1,
#             "variant": [{"label": "Color", "variant": "Black"}]
#         }],
#         total=8255046,
#         address="123 Test Street",
#         phone="0123456789",
#         payment_method="cod"
#     )
    
#     # Assertions
#     assert result["success"] == True
#     assert "order" in result
#     assert result["message"] == "Order created successfully"
    
#     # Verify function calls
#     mock_get_user.assert_called_once_with("6780cbe5f1ded60bba7e9735")
#     # get_product_by_slug is called twice, so we check call count instead
#     assert mock_get_product_by_slug.call_count == 2
#     assert mock_get_product_by_slug.call_args_list[0][0][0] == "motorola-moto-360-(2nd-gen)_12213"
#     assert mock_get_product_by_slug.call_args_list[1][0][0] == "motorola-moto-360-(2nd-gen)_12213"
    
#     mock_check_stock.assert_called_once_with(product_id, 1)
#     mock_update_stock.assert_called_once_with(product_id, 1)
    
#     # Verify order creation call
#     order_data = mock_create_order.call_args[0][0]
#     assert order_data["total"] == 8255046
#     assert order_data["address"] == "123 Test Street"
#     assert order_data["phone"] == "0123456789"
#     assert order_data["paymentMethod"] == "cod"
#     assert len(order_data["products"]) == 1
    
#     print("Test create order result:", result)

# if __name__ == "__main__":
#     test_create_order_success()