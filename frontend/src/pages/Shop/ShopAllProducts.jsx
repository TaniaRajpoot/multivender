import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";

import AllProducts from "../../components/Shop/AllProducts";
const ShopAllProducts = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] md:w-[330px] sticky top-0 z-20">
          <DashboardSideBar active={3} />
        </div>
        <div className="w-full flex justify-center">
          <AllProducts />
        </div>
      </div>
    </div>
  );
};
export default ShopAllProducts;