import React from "react";
import ShopSettings from "../../components/Shop/ShopSettings.jsx";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSidebar from "../../components/Shop/Layout/DashboardSideBar";


const ShopSettingsPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-20 md:w-[100px] lg:w-[330px]">
          <DashboardSidebar active={11} />
        </div>
        <ShopSettings />
      </div>
    </div>
  );
};

export default ShopSettingsPage;