import React from "react";
import ShopLayout from "../../components/ui/ShopLayout";
import WithdrawMoney from "../../components/Shop/WithdrawMoney";

const ShopWithDrawMoneyPage = () => (
  <ShopLayout sidebarActive={7}>
    <WithdrawMoney />
  </ShopLayout>
);

export default ShopWithDrawMoneyPage;
