
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
      <div className="w-20 md:w-[330px] bg-white border-r">
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