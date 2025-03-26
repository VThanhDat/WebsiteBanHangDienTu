import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import Swal from "sweetalert2";
import { apiAddToCart, apiGetProduct, apiGetProducts } from "../../apis";
import { Button } from "../../components";
import DetailDescription from "../../components/DetailDescription";
import InputNumberProduct from "../../components/InputNumberProduct";
import SelectVariant from "../../components/SelectVariant";
import { getCurrent } from "../../store/user/asyncThunk";
import { formatMoney, renderStarFromNumber } from "../../utils/helpers";
import icons from "../../utils/icons";
import path from "../../utils/path";
import { CustomSlider } from "../../components";
import ReactImageMagnify from "react-image-magnify";

const {
  BsShieldShaded,
  MdLocalShipping,
  AiFillGift,
  TbTruckReturn,
  AiFillPhone,
  IoIosArrowRoundBack,
} = icons;

const settings = {
  dots: false,
  infinite: false,
  speed: 300,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const serviceBox = [
  {
    icon: <BsShieldShaded size={24} />,
    title: "Guarantee",
    content: "Quality Checked",
  },
  {
    icon: <MdLocalShipping size={24} />,
    title: "Free Shipping",
    content: "Free On All Products",
  },
  {
    icon: <AiFillGift size={24} />,
    title: "Special Gift Cards",
    content: "Special Gift Cards",
  },
  {
    icon: <TbTruckReturn size={24} />,
    title: "Free Return",
    content: "Within 7 Days",
  },
  {
    icon: <AiFillPhone size={24} />,
    title: "Consultancy",
    content: "Lifetime 24/7/365",
  },
];

const DetailProduct = () => {
  const { slug, category } = useParams();
  const [product, setProduct] = useState(null);
  const [imageActive, setImageActive] = useState("");
  const [available, setAvailable] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [payload, setPayload] = useState([{ label: "", variant: "" }]);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const checkIsLoggedIn = async () => {
    if (!isLoggedIn) {
      await Swal.fire({
        title: "Please login!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Go login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/${path.LOGIN}`);
        }
      });
    }
  };

  const fetchProducts = async () => {
    const response = await apiGetProducts({ category });
    if (response.success) setRelatedProducts(response.products);
  };

  const fetchProductData = async () => {
    const response = await apiGetProduct(slug);
    if (response?.success) {
      setProduct(response.product);
      setImageActive(response.product.thumb);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProductData();
      fetchProducts();
    }
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchProductData();
    }
  }, [update]);

  const rerender = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const handleChangeImage = (link) => {
    setImageActive(link);
  };

  const handleAddToCart = async (pid) => {
    await checkIsLoggedIn();
    const response = await apiAddToCart(token, {
      pid,
      quantity: quantity,
      variant: payload?.map(({ label, variant }) => ({
        label,
        variant: variant.variant,
      })),
    });
    if (response?.success) {
      dispatch(getCurrent(token));
    }
    return response?.success;
  };

  useEffect(() => {
    const availableProductCount = Math.min(
      ...payload.map((el) => el.variant.quantity),
    );
    setAvailable(availableProductCount);
  }, [payload]);

  useEffect(() => {
    fetchProductData();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="full max-w-main">
      {product && (
        <>
          <div className="mb-[50px] flex max-lg:flex-col">
            <div className="w-2/5 max-lg:w-full">
              <div className="mb-5 flex items-center justify-center border">
                <ReactImageMagnify
                  {...{
                    smallImage: {
                      alt: "",
                      isFluidWidth: true,
                      src: imageActive,
                    },
                    largeImage: {
                      src: imageActive,
                      width: 800,
                      height: 800,
                    },
                    isHintEnabled: true,
                  }}
                />
              </div>
              <div className="flex w-full flex-col">
                <div className="mx-[-10px] flex-1">
                  <Slider className="custom-slider" {...settings}>
                    {product?.images.map((link, index) => (
                      <div className="px-[10px]" key={index}>
                        <img
                          className="aspect-square w-full border object-contain outline-none hover:cursor-pointer"
                          src={link}
                          alt=""
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChangeImage(link);
                          }}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>
            <div className="flex w-3/5 max-lg:w-full max-lg:pt-3 max-md:flex-col">
              <div className="pl-[45px] pr-2 max-lg:mb-4 max-lg:pl-0 max-lg:pr-0 md:flex-2">
                <span className="text-[30px] font-semibold">
                  {formatMoney(product?.price)} VNĐ
                </span>
                <span className="mb-3 mt-3 flex">
                  {renderStarFromNumber(product?.totalRatings, 18)}
                  <span className="pl-2 text-sm text-gray-600">
                    {product?.ratings?.length
                      ? `${product?.ratings?.length} ${
                          product?.ratings?.length > 1 ? "reviews" : "review"
                        }`
                      : "0 review"}
                  </span>
                </span>
                <i className="mb-2 flex font-normal text-gray-700">
                  {available
                    ? `Available: ${available}`
                    : "This product is not available"}
                </i>
                <ul className="mb-5 text-sm text-gray-600">
                  {product?.description.map((script, index) => (
                    <li className="list-inside list-square" key={index}>
                      {script}
                    </li>
                  ))}
                </ul>

                {/* Select Variant */}
                <SelectVariant
                  variants={product?.variants}
                  payload={payload}
                  setPayload={setPayload}
                />

                <div className="mb-3 flex items-center">
                  <span className="w-[90px]">Quantity</span>
                  <InputNumberProduct
                    number={quantity}
                    setNumber={setQuantity}
                    available={available}
                  />
                </div>

                {/* Button Add to Cart */}
                <div className="mt-4">
                  <Button
                    name="ADD TO CART"
                    handleClick={async () => {
                      await handleAddToCart(product?._id);
                      return true;
                    }}
                    hasIconSuccess={true}
                  />
                </div>
              </div>
              {/* Information */}
              <div className="md:flex-1">
                {serviceBox.map((box) => (
                  <div
                    key={box.title}
                    className="mb-[10px] flex items-center border p-[10px]"
                  >
                    <span className="mr-3 text-gray-700">{box.icon}</span>
                    <span className="flex flex-col">
                      <span className="text-[14px] text-gray-700">
                        {box.title}
                      </span>
                      <span className="text-[12px] text-gray-500">
                        {box.content}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Link
            to={`/${path.PRODUCTS}/${product?.category?.title.toLowerCase()}`}
            className="mb-[50px] flex items-center justify-center text-sm uppercase text-gray-700 hover:text-main"
          >
            <IoIosArrowRoundBack size={20} />
            {`back to ${product?.category?.title}`}
          </Link>
          <DetailDescription
            description={product?.description}
            review={product?.ratings}
            totalRatings={product?.totalRatings}
            ratings={product?.ratings} // Truyền cả mảng, không phải độ dài
            nameProduct={product?.title}
            pid={product?._id}
            rerender={rerender}
          />
          <div className="my-8">
            <h3 className="mb-5 border-b-2 border-main text-[20px] font-semibold uppercase">
              OTHER CUSTOMER ALSO LIKED
            </h3>
            <CustomSlider products={relatedProducts} />
          </div>
        </>
      )}
    </div>
  );
};

export default DetailProduct;
