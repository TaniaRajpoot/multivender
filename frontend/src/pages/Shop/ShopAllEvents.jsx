import React from "react";
import ShopLayout from "../../components/ui/ShopLayout";
import AllEvents from "../../components/Shop/AllEvents";

const ShopAllEvents = () => (
  <ShopLayout sidebarActive={5}>
    <AllEvents />
  </ShopLayout>
);

export default ShopAllEvents;
