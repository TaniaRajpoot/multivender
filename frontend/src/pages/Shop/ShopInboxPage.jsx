import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSidebar from "../../components/Shop/Layout/DashboardSideBar";
import DashBoardMessages from "../../components/Shop/DashboardMessages";
const ShopInboxPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] md:w-[330px] sticky top-0 z-20">
          <DashboardSidebar active={8} />
        </div>
        <DashBoardMessages />
      </div>
    </div>
  );
};

export default ShopInboxPage;