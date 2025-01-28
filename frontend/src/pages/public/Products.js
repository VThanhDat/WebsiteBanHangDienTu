import React, { memo, useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { apiGetProducts } from "../../apis";
import { Product } from "../../components";
import Filter from "../../components/Filter";
import Pagination from "../../components/Pagination";
import SortBy from "../../components/SortBy";
import noProductFoundImg from "../../assets/no-product.jpg";
import icons from "../../utils/icons";

const { AiOutlineLoading } = icons;

const Products = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const [limitItem, setLimitItem] = useState(12);
  const [sort, setSort] = useState("-createdAt");
  const [priceFilter, setPriceFilter] = useState("");
  const [brandFilter, setbrandFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    const response = await apiGetProducts();
    if (response.success) {
      setProducts(response.products);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="my-[15px] flex min-h-[108px] flex-wrap items-center border p-[10px] text-sm font-semibold text-gray-600">
        <div className="flex w-4/5 flex-col flex-wrap max-md:w-full">
          <p className="mb-[10px]">Fillter by</p>
          <Filter
            setBrandFilter={setbrandFilter}
            setPriceFilter={setPriceFilter}
          />
        </div>
        <div className="w-1/5 max-md:w-full">
          <p className="mb-[10px] max-md:mt-3">Sort by</p>
          <SortBy setValue={setSort} />
        </div>
      </div>
      <div className="mx-[-10px] flex w-full flex-wrap">
        {products?.map((data) => (
          <div
            className="mb-5 w-1/4 px-2 sm:w-full md:w-1/2 lg:w-1/3"
            key={data._id}
          >
            <Product productData={data} isHasLabel={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Products);
