import React from "react";
import SortableImage from "../pages/private/components/SortableImage";

const InputFile = ({
  images,
  nameKey,
  type,
  title,
  setValue,
  invalidFields,
  multiple = false,
  setInvalidFields = () => {},
}) => {
  // Xử lý khi người dùng chọn ảnh
  const changeHandler = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setValue((prev) => ({
      ...prev,
      [nameKey]: [...(prev[nameKey] || []), ...selectedFiles],
    }));
  };

  // Xử lý khi xóa ảnh
  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setValue((prev) => ({ ...prev, [nameKey]: newImages }));
  };

  return (
    <div className="mb-4 w-full text-sm text-gray-700">
      {title && <label className="font-medium">{title}</label>}
      <input
        accept="image/png, image/gif, image/jpeg"
        type={type || "text"}
        className="mt-2 w-full rounded-md border px-4 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
        placeholder={title}
        onChange={changeHandler}
        onFocus={() => setInvalidFields([])}
        multiple={multiple}
      />

      {/* Hiển thị thông báo lỗi */}
      {invalidFields?.some((field) => field.name === nameKey) && (
        <small className="italic text-red-500">
          {invalidFields.find((field) => field.name === nameKey).mes}
        </small>
      )}

      {/* Hiển thị danh sách ảnh đã chọn */}
      <div className="mt-3 flex flex-wrap gap-2">
        {!!images?.length && (
          <SortableImage
            images={images}
            setImages={(newImages) =>
              setValue((prev) => ({ ...prev, [nameKey]: newImages }))
            }
          />
        )}

        {images?.length > 0 &&
          images?.map((image, index) => (
            <div key={index} className="relative h-24 w-24">
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="h-full w-full rounded-md object-cover shadow-sm"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-md hover:bg-red-700"
              >
                ✕
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default InputFile;
