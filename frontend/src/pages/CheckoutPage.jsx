import React from "react";
import StoreLayout from "../components/ui/StoreLayout";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Checkout from "../components/Checkout/Checkout";

const CheckoutPage = () => (
  <StoreLayout showFooter={false}>
    <CheckoutSteps active={2} />
    <Checkout />
  </StoreLayout>
);

export default CheckoutPage;
