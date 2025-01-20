import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import path from "../../utils/path";

const AuthRegister = () => {
  const { status } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!status) return; // Không làm gì nếu `status` không tồn tại
    if (status === "failed") {
      Swal.fire("Opp!", "Register Failed!", "error").then(() => {
        navigate(`/${path.LOGIN}`);
      });
    }
    if (status === "success") {
      Swal.fire("Congration!", "Register is success!", "success").then(() => {
        navigate(`/${path.LOGIN}`);
      });
    }
  }, [status, navigate]); // Chạy khi `status` hoặc `navigate` thay đổi

  return <div className="h-screen w-screen bg-gray-100"></div>;
};

export default AuthRegister;
