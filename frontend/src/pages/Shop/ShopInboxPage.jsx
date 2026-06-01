import React from "react";
import ShopLayout from "../../components/ui/ShopLayout";
import DashboardMessages from "../../components/Shop/DashboardMessages";

const ShopInboxPage = () => (
  <ShopLayout sidebarActive={8}>
    <DashboardMessages />
  </ShopLayout>
);

export default ShopInboxPage;
