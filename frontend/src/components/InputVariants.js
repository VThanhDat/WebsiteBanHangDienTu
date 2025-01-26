import React, { useEffect, useState } from "react";
import icons from "../utils/icons";

const { IoMdAddCircleOutline, IoMdRemoveCircleOutline } = icons;

const defaultValue = [{ label: "", variants: [{ variant: "", quantity: "" }] }];

const InputVariants = ({
  value = [],
  setValue,
  nameKey,
  title,
  invalidFields,
  setInvalidFields = () => {},
}) => {
  const [valueCopy, setValueCopy] = useState(
    JSON.parse(JSON.stringify(value)).length > 0
      ? JSON.parse(JSON.stringify(value))
      : defaultValue,
  );
  const [fieldCount, setFieldCount] = useState(
    valueCopy.length > 0 ? valueCopy.length : 1,
  );

  const [field, setField] = useState([]);

  const handleAddField = (index) => {
    valueCopy.splice(index + 1, 0, {
      label: "",
      variants: [{ variant: "", quantity: "" }],
    });
    setValueCopy(valueCopy);
    setValue((prev) => ({
      ...prev,
      [nameKey]: [...valueCopy],
    }));
    setFieldCount((prev) => prev + 1);
  };

  const handleRemoveField = (indexField, indexVariants) => {
    if (valueCopy[0].variants.length > 0 && valueCopy.length > 1) {
      valueCopy[indexField].variants.splice(indexVariants, 1);
      if (valueCopy[indexField].variants.length === 0) {
        valueCopy.splice(indexField, 1);
        setFieldCount((prev) => {
          return prev - 1;
        });
      }

      setValueCopy(valueCopy);
      setValue((prev) => ({
        ...prev,
        [nameKey]: [...valueCopy],
      }));
    }
  };

  useEffect(() => {
    setField(Array.from({ length: fieldCount }, (_, i) => i + 1));
  }, [fieldCount]);

  return (
    <div className="mb-2 w-full text-sm text-gray-700">
      {title && <label>{title}</label>}

      {field.map((_, indexField) =>
        valueCopy[indexField]?.variants?.map((el, indexVariants) => (
          <div
            className="mt-2 flex items-center"
            key={`${indexField}-${indexVariants}`}
          >
            <input
              className="mr-4 w-full flex-1 rounded-md border px-4 py-2 text-sm placeholder:text-gray-300"
              placeholder={`Label`}
              value={valueCopy[indexField]?.label ?? ""}
              onChange={(e) => {
                setValue((prev) => {
                  valueCopy[indexField].label = e.target.value;
                  return {
                    ...prev,
                    [nameKey]: [...valueCopy],
                  };
                });
              }}
            />
            <input
              type={"text"}
              className="mr-4 w-full flex-2 rounded-md border px-4 py-2 text-sm placeholder:text-gray-300"
              placeholder={`Variant`}
              value={el.variant}
              onChange={(e) =>
                setValue((prev) => {
                  valueCopy[indexField].variants[indexVariants].variant =
                    e.target.value;
                  return {
                    ...prev,
                    [nameKey]: [...valueCopy],
                  };
                })
              }
              onFocus={() => setInvalidFields([])}
            />

            <input
              min={0}
              type={"number"}
              className="w-full flex-1 rounded-md border px-4 py-2 text-sm placeholder:text-gray-300"
              placeholder={`Quantity`}
              value={el.quantity}
              onChange={(e) =>
                setValue((prev) => {
                  valueCopy[indexField].variants[indexVariants].quantity =
                    +e.target.value;
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
                onClick={() => handleAddField(indexField)}
                className="hover:text-main"
              />
            </button>
            <button className="ml-2">
              <IoMdRemoveCircleOutline
                size={20}
                onClick={() => handleRemoveField(indexField, indexVariants)}
                className="hover:text-main"
              />
            </button>
          </div>
        )),
      )}
      {invalidFields?.some((field) => field.name === nameKey) && (
        <small className="italic text-main">
          {invalidFields?.find((field) => field.name === nameKey).mes}
        </small>
      )}
    </div>
  );
};

export default InputVariants;
