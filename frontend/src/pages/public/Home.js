import React, { useEffect } from "react";
import {
  Sidebar,
  Banner,
  BestSeller,
  DealDaily,
  FeatureProduct,
} from "../../components";
const Home = () => {
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
    </>
  );
};

export default Home;
