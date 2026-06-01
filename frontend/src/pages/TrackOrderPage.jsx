import React from "react";
import TrackOrder from "../components/profile/TrackOrder.jsx";
import StoreLayout from "../components/ui/StoreLayout";

const TrackOrderPage = () => (
  <StoreLayout>
    <div className="max-w-6xl mx-auto px-4 py-10">
      <TrackOrder />
    </div>
  </StoreLayout>
);

export default TrackOrderPage;
