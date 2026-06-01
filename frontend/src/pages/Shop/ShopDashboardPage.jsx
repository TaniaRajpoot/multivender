import React from "react";
import ShopLayout from "../../components/ui/ShopLayout";
import DashboardHero from "../../components/Shop/DashboardHero";

const ShopDashboardPage = () => (
  <ShopLayout sidebarActive={1}>
    <DashboardHero />
  </ShopLayout>
);

export default ShopDashboardPage;
