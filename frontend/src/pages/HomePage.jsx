import React from "react";
import StoreLayout from "../components/ui/StoreLayout";
import Hero from "../components/Route/Hero/Hero";
import Categories from "../components/Route/Categories/Categories";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import Events from "../components/Events/Events";
import FeatureProduct from "../components/Route/FeatureProduct/FeatureProduct";
import Sponsered from "../components/Route/Sponsered/Sponsered";

const HomePage = () => (
  <StoreLayout activeHeading={1}>
    <Hero />
    <Categories />
    <BestDeals />
    <Events />
    <FeatureProduct />
    <Sponsered />
  </StoreLayout>
);

export default HomePage;
