import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import AllCoupons from "../../components/Shop/AllCoupons";

const ShopAllCoupons = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] md:w-[330px] sticky top-0 z-20">
          <DashboardSideBar active={9} />
        </div>
        <div className="w-full flex justify-center">
          <AllCoupons />
        </div>
      </div>
    </div>
  );
};
export default ShopAllCoupons;