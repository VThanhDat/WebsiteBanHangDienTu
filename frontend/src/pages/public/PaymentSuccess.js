import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { apiClearCart } from "../../apis";
import { getCurrent } from "../../store/user/asyncThunk";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resultCode = params.get("resultCode");
    const message = decodeURIComponent(
      params.get("message") || "Unknown error",
    );

    // Lấy cids từ localStorage thay vì location.state
    const pendingClearCart = localStorage.getItem("pendingClearCart");
    const cids = pendingClearCart ? JSON.parse(pendingClearCart) : [];

    if (resultCode === "0" || !resultCode) {
      // resultCode sẽ không tồn tại trong trường hợp COD
      // Nếu thanh toán thành công hoặc là trường hợp COD
      Swal.fire(
        "Payment Successful!",
        "Thank you for your purchase!",
        "success",
      ).then(async () => {
        if (cids && cids.length > 0) {
          // Gọi API để xóa giỏ hàng sau khi thanh toán thành công
          const response = await apiClearCart(token, {
            cids: cids,
          });

          if (response?.success) {
            // Xóa dữ liệu đã lưu
            localStorage.removeItem("pendingClearCart");

            // Cập nhật lại thông tin người dùng
            dispatch(getCurrent(token));

            // Chuyển hướng đến trang đơn hàng
            navigate("/account/orders");
          } else {
            Swal.fire("Error!", "Failed to clear the cart.", "error");
            navigate("/");
          }
        } else {
          console.log("No items to clear from cart");
          navigate("/account/orders");
        }
      });
    } else {
      // Nếu thanh toán thất bại
      Swal.fire("Payment Failed", message, "error").then(() => {
        navigate("/");
      });
    }
  }, [location, navigate, dispatch, token]);

  return null;
};

export default PaymentSuccess;
