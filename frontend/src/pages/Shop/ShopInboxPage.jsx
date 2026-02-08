import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSidebar from "../../components/Shop/Layout/DashboardSideBar";
import DashBoardMessages from "../../components/Shop/DashBoardMessages.jsx";
const ShopInboxPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
      <div className="w-20 md:w-[330px] bg-white border-r">
          <DashboardSidebar active={8} />
        </div>
        <DashBoardMessages />
      </div>
    </div>
  );
};

export default ShopInboxPage;