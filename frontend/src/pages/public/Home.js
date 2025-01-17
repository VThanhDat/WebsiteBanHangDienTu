import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import {
  Sidebar,
  Banner,
  BestSeller,
  DealDaily,
  FeatureProduct,
  CustomSlider,
} from "../../components";
import icons from "../../utils/icons";
import path from "../../utils/path";

const settings = {
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 5,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};

const logo = [
  "https://cdn.shopify.com/s/files/1/1903/4853/files/logo-1_large_large_768f374b-12c0-4dd0-b9ef-7585f08cdc38_160x160.png?v=1613166661",
  "https://cdn.shopify.com/s/files/1/1903/4853/files/logo-2_large_large_1c0f984f-9760-4b73-866e-10b9d225d851_160x160.png?v=1613166661",
  "https://cdn.shopify.com/s/files/1/1903/4853/files/logo-4_large_large_f4d00a02-3fbf-4bf1-81a6-daec160e076f_160x160.png?v=1613166661",
  "https://cdn.shopify.com/s/files/1/1903/4853/files/logo-5_large_large_2629fcad-3956-4ce9-9265-c2e31d94a8c5_160x160.png?v=1613166661",
  "https://cdn.shopify.com/s/files/1/1903/4853/files/logo-6_large_large_e49d4a97-fd54-48c7-9865-8fc912607190_160x160.png?v=1613166661",
  "https://cdn.shopify.com/s/files/1/1903/4853/files/logo-7_large_large_de3782ee-9ae1-44b9-b73f-0a77d9c266ee_160x160.png?v=1613166661",
  "https://cdn.shopify.com/s/files/1/1903/4853/files/logo-3_large_large_64561f36-72d3-4858-9199-b22f31a90dc2_160x160.png?v=1613166661",
];

const { IoIosArrowForward } = icons;

const Home = () => {
  const { newProducts } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.app);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="flex w-full max-w-main flex-col">
        <div className="mb-5 flex w-full">
          <div className="flex w-[25%] flex-col gap-5 pr-5 max-lg:hidden">
            <Sidebar />
          </div>
          <div className="flex w-[75%] flex-col gap-5 max-lg:w-full">
            <Banner />
          </div>
        </div>
        <div className="flex w-full max-lg:flex-col">
          <div className="w-full flex-grow-0 max-lg:w-full lg:max-w-[25%] lg:pr-5">
            <DealDaily />
          </div>
          <div className="w-full max-lg:w-full lg:max-w-[75%]">
            <BestSeller />
          </div>
        </div>
      </div>

      <div className="my-8">
        <FeatureProduct />
      </div>

      <div className="my-8">
        <h3 className="mb-5 border-b-2 border-main text-[20px] font-semibold uppercase">
          New arrivals
        </h3>
        <div className="mx-[-10px] mt-4">
          <CustomSlider products={newProducts} />
        </div>
      </div>

      <div className="my-8">
        <h3 className="mb-5 border-b-2 border-main text-[20px] font-semibold uppercase">
          Hot collections
        </h3>
        <div className="mt-4 flex w-full flex-wrap max-md:[&>*:nth-child(2n)]:pr-0 md:[&>*:nth-child(4n)]:pr-0 max-sm:[&>*:nth-child(n)]:pr-0">
          {categories?.map((item) => (
            <div
              className="flex w-1/4 flex-initial pb-5 pr-5 max-md:w-1/2 max-sm:w-full"
              key={item._id}
            >
              <div className="flex min-h-[200px] w-full border p-4">
                <Link
                  className="flex flex-1 justify-center"
                  to={`/${path.PRODUCTS}/${item?.title?.toLowerCase()}`}
                >
                  <img
                    src={item.image}
                    alt=""
                    className="h-[120px] w-[120px] object-contain"
                  />
                </Link>
                <div className="flex-1 pl-5 text-gray-700">
                  <Link
                    className="font-semibold uppercase hover:text-main"
                    to={`/${path.PRODUCTS}/${item?.title?.toLowerCase()}`}
                  >
                    {item.title}
                  </Link>
                  <ul className="text-sm">
                    {item.brand
                      .map((item) => item)
                      ?.sort((a, b) => {
                        if (a?.productCount > b?.productCount) {
                          return -1;
                        }
                        if (a?.productCount < b?.productCount) {
                          return 1;
                        }
                        return 0;
                      })
                      ?.map((brand, index) => {
                        if (index < 7) {
                          return (
                            <Link
                              state={brand?.title}
                              to={`/${
                                path.PRODUCTS
                              }/${item?.title?.toLowerCase()}`}
                              key={brand?._id}
                              className="flex items-center text-gray-500 hover:text-main"
                            >
                              <IoIosArrowForward size={14} />
                              <p>{brand?.title}</p>
                            </Link>
                          );
                        } else return null;
                      })}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="my-8">
        <h3 className="mb-5 border-b-2 border-main text-[20px] font-semibold uppercase">
          Blog posts
        </h3>
      </div>
      <div className="flex w-full flex-col items-center">
        <div className="mb-8 flex h-[90px] w-full max-w-main items-center justify-between max-xl:px-3">
          <div className="w-full">
            <Slider className="custom-slider" {...settings}>
              {logo.map((item, index) => (
                <img
                  src={item}
                  key={index}
                  alt=""
                  className="h-[60px] w-[160px] object-contain"
                />
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
