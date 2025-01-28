import React from "react";
import Select from "react-select";
import CustomSelect from "./CustomSelect";

const options = [
  { value: "title", label: "A-Z" },
  { value: "-title", label: "Z-A" },
  { value: "-sold", label: "Best Selling" },
  { value: "price", label: "Price, low to high" },
  { value: "-price", label: "Price, high to low" },
  { value: "-createdAt", label: "Date, old to new" },
  { value: "createdAt", label: "Date, new to old" },
];

const SortBy = ({ setValue = () => {} }) => {
  return (
    <CustomSelect
      defaultValue={options[5]}
      isSearchable={false}
      onChange={(e) => {
        setValue(e.value);
      }}
      options={options}
    />
  );
};

export default SortBy;
