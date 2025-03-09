import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InputField = ({
  value,
  setValue,
  nameKey,
  type,
  title,
  invalidFields,
  setInvalidFields = () => {},
  handleSubmit = () => {},
}) => {
  return (
    <div className="mb-2 w-full text-sm text-gray-700">
      {title && <label>{title}</label>}
      {nameKey === "expiry" ? (
        <DatePicker
          selected={
            value instanceof Date && !isNaN(value.getTime()) ? value : null
          }
          onChange={(date) =>
            setValue((prev) => ({ ...prev, [nameKey]: date }))
          }
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="HH:mm:ss dd/MM/yyyy"
          customInput={
            <input
              type="text"
              className="mt-2 w-full rounded-md border px-4 py-2 text-sm outline-none placeholder:text-gray-300"
            />
          }
        />
      ) : (
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          type={type || "text"}
          className="mt-2 w-full rounded-md border px-4 py-2 text-sm outline-none placeholder:text-gray-300"
          placeholder={title}
          value={value}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, [nameKey]: e.target.value }))
          }
          onFocus={() => setInvalidFields([])}
        />
      )}
      {invalidFields?.some((field) => field.name === nameKey) && (
        <small className="italic text-main">
          {invalidFields?.find((field) => field.name === nameKey).mes}
        </small>
      )}
    </div>
  );
};

export default InputField;
