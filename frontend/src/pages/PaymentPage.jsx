import React from "react";
import Header from "../components/Layout/Header";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Payment from "../components/Payment/Payment";
import StripeWrapper from "../components/Payment/StripeWrapper";
import Footer from "../components/Layout/Footer";

const PaymentPage = () => {
  return (
    <div className="w-full min-h-screen bg-[#f6f9fc]">
      <Header />
      <br />
      <br />
      <CheckoutSteps active={2} />
      <StripeWrapper>
        <Payment />
      </StripeWrapper>
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default PaymentPage;