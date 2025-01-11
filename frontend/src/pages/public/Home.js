import React from "react";
import { Sidebar, Banner } from "../../components";
const Home = () => {
  return (
    <div className="flex w-main">
      <div className="flex w-[25%] flex-auto flex-col gap-5 border">
        <Sidebar />
        <span>Deal daily</span>
      </div>
      <div className="flex w-[75%] flex-auto flex-col gap-5 border pl-5">
        <Banner />
        <span>Best seller</span>
      </div>
    </div>
  );
};

export default Home;
