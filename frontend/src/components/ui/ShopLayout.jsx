import React from "react";
import DashboardHeader from "../Shop/Layout/DashboardHeader";
import DashboardSideBar from "../Shop/Layout/DashboardSideBar";

const ShopLayout = ({ sidebarActive = 1, children }) => (
  <div className="min-h-screen bg-gray-50">
    <DashboardHeader />
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 p-4 sm:p-6">
      <div className="w-full md:w-64 shrink-0">
        <DashboardSideBar active={sidebarActive} />
      </div>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  </div>
);

export default ShopLayout;
