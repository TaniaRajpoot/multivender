import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import AllRefundOrders from "../../components/Shop/AllRefundOrders";
import DashboardSidebar from "../../components/Shop/Layout/DashboardSideBar";
const ShopAllRefunds = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="w-20 md:w-[100px] lg:w-[330px]">
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