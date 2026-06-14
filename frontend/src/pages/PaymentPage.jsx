import React from "react";
import StoreLayout from "../components/ui/StoreLayout";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Payment from "../components/Payment/Payment";
import StripeWrapper from "../components/Payment/StripeWrapper";

const PaymentPage = () => (
  <StoreLayout showFooter={false}>
    <CheckoutSteps active={3} />
    <StripeWrapper>
      <Payment />
    </StripeWrapper>
  </StoreLayout>
);

export default PaymentPage;
