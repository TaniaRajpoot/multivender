import React from "react";
import StoreLayout from "../components/ui/StoreLayout";
import Lottie from "react-lottie";
import animationData from "../assets/payment-success";
import { Link } from "react-router-dom";
import { ui } from "../styles/theme";

const OrderSuccessPage = () => (
  <StoreLayout>
    <div className="flex items-center justify-center py-16 px-4">
      <Success />
    </div>
  </StoreLayout>
);

const Success = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  return (
    <div className={`${ui.card} ${ui.cardPadding} max-w-lg text-center`}>
      <Lottie options={defaultOptions} width={120} height={120} />
      <h1 className={`${ui.title} mt-4`}>Order placed!</h1>
      <p className={`${ui.subtitle} mb-8`}>Thank you. We sent a confirmation to your email.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className={ui.btnPrimary}>Continue shopping</Link>
        <Link to="/profile?tab=track-order" className={ui.btnSecondary}>View my orders</Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
