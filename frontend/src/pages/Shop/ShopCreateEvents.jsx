import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import CreateEvent from "../../components/Shop/CreateEvent";
const ShopCreateEvents = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-center justify-between w-full">
      <div className="w-20 md:w-[330px] bg-white border-r">
          <DashboardSideBar active={6} />
        </div>
        <div className="w-full justify-center flex">
          <CreateEvent />
        </div>
      </div>
    </div>
  );
};

export default ShopCreateEvents;