import React, { useEffect, useState } from "react";
import icons from "../../utils/icons";

const { IoMdAddCircleOutline, IoMdRemoveCircleOutline } = icons;

const InputDynamic = ({
  value = [],
  setValue,
  nameKey,
  type,
  title,
  invalidFields,
  setInvalidFields = () => {},
}) => {
  const [valueCopy, setValueCopy] = useState([...value]);
  const [fieldCount, setFieldCount] = useState(
    valueCopy.length > 0 ? valueCopy.length : 1,
  );
  const [field, setField] = useState([]);

  const handleAddField = (index) => {
    valueCopy.splice(index + 1, 0, "");
    setValueCopy(valueCopy);
    setValue((prev) => ({
      ...prev,
      [nameKey]: [...valueCopy],
    }));
    setFieldCount((prev) => prev + 1);
  };

  const handleRemoveField = (index) => {
    if (valueCopy.length > 1) {
      valueCopy.splice(index, 1);
      setValueCopy(valueCopy);
      setValue((prev) => ({
        ...prev,
        [nameKey]: [...valueCopy],
      }));
      setFieldCount((prev) => {
        return prev - 1;
      });
    }
  };

  useEffect(() => {
    setField(Array.from({ length: fieldCount }, (_, i) => i + 1));
  }, [fieldCount]);

  return (
    <div className="mb-2 w-full text-sm text-gray-700">
      {title && <label>{title}</label>}

      {field.map((count, index) => (
        <div className="mt-2 flex items-center" key={count}>
          <input
            type={type || "text"}
            className="w-full rounded-md border px-4 py-2 text-sm placeholder:text-gray-300"
            placeholder={`${title} ${count}`}
            value={valueCopy[index] ?? ""}
            onChange={(e) =>
              setValue((prev) => {
                valueCopy[index] = e.target.value;
                return {
                  ...prev,
                  [nameKey]: [...valueCopy],
                };
              })
            }
            onFocus={() => setInvalidFields([])}
          />
          <button className="ml-2">
            <IoMdAddCircleOutline
              size={20}
              onClick={() => handleAddField(index)}
              className="hover:text-main"
            />
          </button>
          <button className="ml-2">
            <IoMdRemoveCircleOutline
              size={20}
              onClick={() => handleRemoveField(index)}
              className="hover:text-main"
            />
          </button>
        </div>
      ))}
      {invalidFields?.some((field) => field.name === nameKey) && (
        <small className="italic text-main">
          {invalidFields?.find((field) => field.name === nameKey).mes}
        </small>
      )}
    </div>
  );
};

export default InputDynamic;
