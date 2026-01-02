import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import AllEvents from "../../components/Shop/AllEvents";
const ShopAllEvents = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
      <div className="w-20 md:w-[330px] bg-white border-r">
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