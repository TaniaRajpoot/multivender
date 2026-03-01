
import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import DashboardHero from "../../components/Shop/DashboardHero";

const ShopDashboardPage = () => {
  return (
    <div className="w-full">
      <DashboardHeader />

      <div className="flex w-full min-h-screen">

        {/* Sidebar */}
        <div className="w-[80px] 800px:w-[330px] sticky top-0 z-20">
          <DashboardSideBar active={1} />
        </div>

        {/* Dashboard Main Content */}
        <div className="flex-1 p-3 800px:p-6 overflow-x-hidden">
          <DashboardHero />
        </div>

      </div>
    </div>
  );
};

export default ShopDashboardPage;