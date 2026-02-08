import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader.jsx";
import Footer from "../../components/Layout/Footer.jsx";
import OrderDetails from "../../components/Shop/OrderDetails.jsx";

const ShopOrderDetails = () => {
  return (
    <div>
      <DashboardHeader />
      <OrderDetails />
      <Footer />
    </div>
  );
};

export default ShopOrderDetails;