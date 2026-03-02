import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import AllRefundOrders from "../../components/Shop/AllRefundOrders";
import DashboardSidebar from "../../components/Shop/Layout/DashboardSideBar";
const ShopAllRefunds = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] md:w-[330px] sticky top-0 z-20">
          <DashboardSidebar active={10} />
        </div>
        <div className="w-full flex justify-center">
          <AllRefundOrders />
        </div>
      </div>
    </div>
  );
};

export default ShopAllRefunds;