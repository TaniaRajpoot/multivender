import React from "react";
import ShopLayout from "../../components/ui/ShopLayout";
import CreateEvent from "../../components/Shop/CreateEvent";

const ShopCreateEvents = () => (
  <ShopLayout sidebarActive={6}>
    <CreateEvent />
  </ShopLayout>
);

export default ShopCreateEvents;
