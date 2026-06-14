import React from "react";
import StoreLayout from "../components/ui/StoreLayout";
import Checkout from "../components/Checkout/Checkout";

const CheckoutPage = () => (
  <StoreLayout showFooter={false}>
    <Checkout />
  </StoreLayout>
);

export default CheckoutPage;
