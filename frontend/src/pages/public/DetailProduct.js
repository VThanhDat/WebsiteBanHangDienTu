import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGetProduct } from "../../apis";
import { BreadCrumb } from "../../components";
const DetailProduct = () => {
  const { pid, title } = useParams();
  const fetchProductData = async () => {
    const response = await apiGetProduct(pid);
    console.log(response);
  };
  useEffect(() => {
    if (pid) fetchProductData();
  }, [pid]);

  return (
    <div className="w-full">
      <div className="flex h-[81px] items-center justify-center bg-gray-100">
        <div className="w-main">
          <h3>{title}</h3>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
