import React from "react";

import AllOrders from "../../components/Shop/AllOrders";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSidebar from "../../components/Shop/Layout/DashboardSideBar"

const ShopAllOrders = () => {
  return (
    <div>
      <DashboardHeader />"
      <div className="flex justify-between w-full">
      <div className="w-20 md:w-[330px] bg-white border-r">
          <DashboardSidebar active={2} />
        </div>
        <div className="w-full flex justify-center">
          <AllOrders />
        </div>
      </div>
    </div>
  );
};

export default ShopAllOrders;