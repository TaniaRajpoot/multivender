import React from "react";
import ShopLayout from "../../components/ui/ShopLayout";
import AllProducts from "../../components/Shop/AllProducts";

const ShopAllProducts = () => (
  <ShopLayout sidebarActive={3}>
    <AllProducts />
  </ShopLayout>
);

export default ShopAllProducts;
