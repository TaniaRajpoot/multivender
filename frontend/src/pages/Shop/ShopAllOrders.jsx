import React from "react";
import ShopLayout from "../../components/ui/ShopLayout";
import AllOrders from "../../components/Shop/AllOrders";

const ShopAllOrders = () => (
  <ShopLayout sidebarActive={2}>
    <AllOrders />
  </ShopLayout>
);

export default ShopAllOrders;
