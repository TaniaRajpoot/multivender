import React from "react";
import ShopLayout from "../../components/ui/ShopLayout";
import AllCoupons from "../../components/Shop/AllCoupons";

const ShopAllCoupons = () => (
  <ShopLayout sidebarActive={9}>
    <AllCoupons />
  </ShopLayout>
);

export default ShopAllCoupons;
