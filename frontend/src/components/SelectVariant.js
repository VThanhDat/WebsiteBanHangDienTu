import React, { useEffect } from "react";

const SelectVariant = ({ variants, payload, setPayload = () => {} }) => {
  const filterUniqueVariants = (payload) => {
    const uniqueVariants = {};

    payload.forEach((item) => {
      uniqueVariants[item.label] = item.variant;
    });

    const uniqueData = Object.keys(uniqueVariants).map((label) => {
      return {
        label: label,
        variant: uniqueVariants[label],
      };
    });

    return uniqueData;
  };

  useEffect(() => {
    setPayload(
      variants.map((variant) => ({
        label: variant?.label,
        variant: variant?.variants.find((el) => el.quantity > 0),
      })),
    );
  }, [variants, setPayload]);
  return (
    <div>
      {variants?.map((variant) => (
        <div className="mb-3 flex items-center" key={variant.label}>
          <span className="w-[90px] flex-shrink-0">{variant?.label}</span>
          <div className="flex flex-wrap gap-2">
            {variant?.variants?.map((el) => (
              <button
                disabled={el.quantity <= 0}
                key={el.variant}
                className={`flex items-center border px-4 py-3 text-center text-sm uppercase ${
                  payload.some((item) => {
                    return (
                      item.variant.variant === el.variant &&
                      item.label === variant.label &&
                      el.quantity > 0
                    );
                  })
                    ? "border-main text-main"
                    : "hover:border-gray-400"
                } ${el.quantity <= 0 && "bg-gray-200 opacity-50 hover:border-transparent"}`}
                onClick={() => {
                  setPayload((prev) =>
                    filterUniqueVariants([
                      ...prev,
                      {
                        label: variant?.label,
                        variant: el,
                      },
                    ]),
                  );
                }}
              >
                {el.variant}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectVariant;
