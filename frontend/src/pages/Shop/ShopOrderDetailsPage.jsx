import React from "react";
import ShopLayout from "../../components/ui/ShopLayout";
import OrderDetails from "../../components/Shop/OrderDetails";

const ShopOrderDetailsPage = () => (
  <ShopLayout sidebarActive={2}>
    <OrderDetails />
  </ShopLayout>
);

export default ShopOrderDetailsPage;
