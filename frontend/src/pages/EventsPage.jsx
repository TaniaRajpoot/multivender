import React from "react";
import StoreLayout from "../components/ui/StoreLayout";
import Events from "../components/Events/Events";

const EventsPage = () => (
  <StoreLayout activeHeading={4}>
    <Events />
  </StoreLayout>
);

export default EventsPage;
