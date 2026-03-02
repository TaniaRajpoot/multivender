import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import AllEvents from "../../components/Shop/AllEvents";
const ShopAllEvents = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] md:w-[330px] sticky top-0 z-20">
          <DashboardSideBar active={5} />
        </div>
        <div className="w-full flex justify-center">
          <AllEvents />
        </div>
      </div>
    </div>
  );
};
export default ShopAllEvents;