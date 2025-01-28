import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { apiGetBrands, apiGetCategories } from "../apis";
import CustomSelect from "./CustomSelect";

const priceOptions = [
  { value: "", label: "Price - All" },
  { value: { gt: 0, lte: 1000000 }, label: "0 - 1.000.000 VND" },
  {
    value: { gt: 1000000, lte: 2000000 },
    label: "1.000.000 VND - 2.000.000 VND",
  },
  {
    value: { gt: 2000000, lte: 3000000 },
    label: "2.000.000 VND - 3.000.000 VND",
  },
  {
    value: { gt: 3000000, lte: 5000000 },
    label: "3.000.000 VND - 5.000.000 VND",
  },
  {
    value: { gt: 5000000, lte: 7000000 },
    label: "5.000.000 VND - 7.000.000 VND",
  },
  {
    value: { gt: 7000000, lte: 10000000 },
    label: "7.000.000 VND - 10.000.000 VND",
  },
  {
    value: { gt: 10000000, lte: 15000000 },
    label: "10.000.000 VND - 15.000.000 VND",
  },
  {
    value: { gt: 15000000, lte: 20000000 },
    label: "15.000.000 VND - 20.000.000 VND",
  },
  {
    value: { gt: 20000000, lte: 30000000 },
    label: "20.000.000 VND - 30.000.000 VND",
  },
  { value: { gt: 30000000 }, label: "30.000.000 VND +" },
];

const Filter = ({ setPriceFilter = () => {}, setBrandFilter = () => {} }) => {
  const { pathname, state } = useLocation();
  const [brands, setBrands] = useState([{ value: "", label: "Brand - All" }]);
  const [defaultBrandSelect, setDefaultBrandSelect] = useState({
    value: "",
    label: "Brand - All",
  });

  const fetchBrands = async () => {
    const response = await apiGetBrands();
    if (response?.success) {
      const brandOptions =
        response?.brands
          ?.filter((brand) => brand?.productCount !== 0)
          ?.map((brands) => ({
            value: brands.title?.toLowerCase(),
            label: brands.title,
          })) || [];
      brandOptions.sort((a, b) => {
        const labelA = a.label?.toLowerCase();
        const labelB = b.label?.toLowerCase();
        if (labelA < labelB) {
          return -1;
        }
        if (labelA > labelB) {
          return 1;
        }
        return 0;
      });
      setBrands((prev) => [...prev, ...brandOptions]);
    }
  };

  const fetchBrandsOfCategory = async () => {
    const arrLocation = pathname.split("/");
    let category;
    if (arrLocation[1] === "products") {
      category = arrLocation[2];
    }
    const response = await apiGetCategories({ title: category });

    if (response?.success) {
      const brandOptions =
        response?.prodCategories[0]?.brand
          ?.filter((brand) => brand?.productCount !== 0)
          ?.map((brands) => ({
            value: brands.title.toLowerCase(),
            label: brands.title,
          })) || [];
      brandOptions.sort((a, b) => {
        const labelA = a.label.toLowerCase();
        const labelB = b.label.toLowerCase();
        if (labelA < labelB) {
          return -1;
        }
        if (labelA > labelB) {
          return 1;
        }
        return 0;
      });
      setBrands((prev) => [...prev, ...brandOptions]);
    }
  };
  useEffect(() => {
    if (state)
      setDefaultBrandSelect({
        value: state?.toLowerCase(),
        label: state,
      });
    setBrandFilter(state?.toLowerCase());
  }, [state]);

  useEffect(() => {
    const arrLocation = pathname.split("/");
    let category;
    if (arrLocation[1] === "products") {
      category = arrLocation[2];
    }
    if (!category) fetchBrands();
    else {
      fetchBrandsOfCategory();
    }
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      <div className="w-1/4 max-md:w-full">
        <CustomSelect
          placeholder="Price"
          defaultValue={priceOptions[0]}
          isSearchable={false}
          options={priceOptions}
          onChange={(e) => setPriceFilter(e.value)}
        />
      </div>
      <div className="w-1/4 max-md:w-full">
        <CustomSelect
          placeholder="Brand"
          value={defaultBrandSelect}
          isSearchable={false}
          options={brands}
          onChange={(e) => {
            setBrandFilter(e.value);
            setDefaultBrandSelect(e);
          }}
        />
      </div>
    </div>
  );
};

export default Filter;
