import React from "react";
import ShopLayout from "../../components/ui/ShopLayout";
import ShopSettings from "../../components/Shop/ShopSettings";

const ShopSettingsPage = () => (
  <ShopLayout sidebarActive={11}>
    <ShopSettings />
  </ShopLayout>
);

export default ShopSettingsPage;
