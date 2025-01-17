import React from "react";

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
      <input
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
        type={type || "text"}
        className="mt-2 w-full rounded-md border px-4 py-2 text-sm placeholder:text-gray-300"
        placeholder={title}
        value={value}
        onChange={(e) =>
          setValue((prev) => ({ ...prev, [nameKey]: e.target.value }))
        }
        onFocus={() => setInvalidFields([])}
      />
      {invalidFields?.some((field) => field.name === nameKey) && (
        <small className="italic text-main">
          {invalidFields?.find((field) => field.name === nameKey).mes}
        </small>
      )}
    </div>
  );
};

export default InputField;
