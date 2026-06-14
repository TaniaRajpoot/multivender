import React from "react";
import ShopLayout from "../../components/ui/ShopLayout";
import AllRefundOrders from "../../components/Shop/AllRefundOrders";

const ShopAllRefunds = () => (
  <ShopLayout sidebarActive={10}>
    <AllRefundOrders />
  </ShopLayout>
);

export default ShopAllRefunds;
