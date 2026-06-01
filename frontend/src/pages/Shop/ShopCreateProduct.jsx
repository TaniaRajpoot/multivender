import React from "react";
import ShopLayout from "../../components/ui/ShopLayout";
import CreateProduct from "../../components/Shop/CreateProduct";

const ShopCreateProduct = () => (
  <ShopLayout sidebarActive={4}>
    <CreateProduct />
  </ShopLayout>
);

export default ShopCreateProduct;
