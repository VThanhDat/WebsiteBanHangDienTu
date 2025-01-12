import React, { useEffect } from "react";
import { Sidebar, Banner, BestSeller } from "../../components";
const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex w-main">
      <div className="flex w-[25%] flex-auto flex-col gap-5 border">
        <Sidebar />
        <span>Deal daily</span>
      </div>
      <div className="flex w-[75%] flex-auto flex-col gap-5 border pl-5">
        <Banner />
        <BestSeller />
      </div>
    </div>
  );
};

export default Home;
