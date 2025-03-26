import React from "react";
import CustomSelect from "../common/CustomSelect";

const InputSelect = ({
  isMulti = true,
  setValue,
  nameKey,
  title,
  defaultValue,
  invalidFields,
  selectOptions,
  setInvalidFields = () => {},
}) => {
  return (
    <div className="mb-3 w-full text-sm text-gray-700">
      {title && <label className="mb-2 block font-medium">{title}</label>}
      <CustomSelect
        defaultValue={defaultValue}
        isMulti={isMulti}
        name={nameKey}
        options={selectOptions}
        className="rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
        classNamePrefix="select"
        placeholder={isMulti ? "Chọn một hoặc nhiều mục..." : "Chọn một mục..."}
        onChange={(data) => {
          if (!data) return;
          setValue((prev) =>
            isMulti
              ? { ...prev, [nameKey]: data.map((item) => item.value) || [] }
              : { ...prev, [nameKey]: data?.value || "" },
          );
        }}
        onFocus={() => setInvalidFields([])}
      />
      {invalidFields?.some((field) => field.name === nameKey) && (
        <small className="italic text-red-500">
          {invalidFields.find((field) => field.name === nameKey).mes}
        </small>
      )}
    </div>
  );
};

export default InputSelect;
