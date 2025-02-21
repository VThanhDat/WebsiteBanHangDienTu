import React from "react";
import Gallery from "react-photo-gallery";
import Photo from "./Photo";
import { arrayMoveImmutable } from "array-move";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

const SortablePhoto = SortableElement((item) => <Photo {...item} />);
const SortableGallery = SortableContainer(({ items }) => (
  <Gallery
    photos={items}
    renderImage={(props) => <SortablePhoto {...props} />}
  />
));

const SortableImage = ({ images, setImages }) => {
  const imagesFormatted = images.map((image) => ({
    src: image,
    width: 1,
    heigh: 1,
  }));
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setImages((prev) => ({
      ...prev,
      images: arrayMoveImmutable(images, oldIndex, newIndex),
    }));
  };
  return (
    <div>
      <SortableGallery
        items={imagesFormatted}
        onSortEnd={onSortEnd}
        axis={"xy"}
      />
    </div>
  );
};

export default SortableImage;
