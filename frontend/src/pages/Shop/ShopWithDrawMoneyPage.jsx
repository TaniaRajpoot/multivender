import React from "react";
import DashboardSidebar from "../../components/Shop/Layout/DashboardSideBar";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import WithDrawMoney from "../../components/Shop/WithDrawMoney";
const ShopWithDrawMoneyPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-20 md:w-[100px] lg:w-[330px]">
          <DashboardSidebar active={7} />
        </div>
        <WithDrawMoney />
      </div>
      
    </div>
  );
};

export default ShopWithDrawMoneyPage;