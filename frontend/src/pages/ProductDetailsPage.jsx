import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductDetails from "../components/Products/ProductDetails";
import { useParams, useSearchParams } from "react-router-dom";
import { productData } from "../static/data";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useSelector } from "react-redux";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { allProducts } = useSelector((state) => state.product);
  const { allEvents } = useSelector((state) => state.events);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");
  const [data, setData] = useState(null);


  useEffect(() => {
    if (eventData !== null) {
      const event = allEvents && allEvents.find((i) => i._id === id);
      setData(event);
    } else {
      const product = allProducts && allProducts.find((i) => i._id === id);
      setData(product);
    }
  }, [allProducts, allEvents, id, eventData]);
  window.scrollTo(0, 0);
return (
    <div>
      <Header />
      <br />
      <ProductDetails data={data} />
      {!eventData && <>{data && <SuggestedProduct data={data} />}</>}
      <br />
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;