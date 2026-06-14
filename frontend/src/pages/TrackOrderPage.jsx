import React from "react";
// ✅ correct
import TrackOrder from "../components/Profile/TrackOrder.jsx";
import StoreLayout from "../components/ui/StoreLayout";
const TrackOrderPage = () => (
  <StoreLayout>
    <div className="max-w-6xl mx-auto px-4 py-10">
      <TrackOrder />
    </div>
  </StoreLayout>
);

export default TrackOrderPage;
