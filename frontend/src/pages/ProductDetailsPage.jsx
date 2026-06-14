import React, { useEffect, useState } from "react";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import StoreLayout from "../components/ui/StoreLayout";
import { useParams, useSearchParams } from "react-router-dom";
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
      const event = allEvents?.find((i) => i._id === id);
      setData(event);
    } else {
      const product = allProducts?.find((i) => i._id === id);
      setData(product);
    }
    window.scrollTo(0, 0);
  }, [allProducts, allEvents, id, eventData]);

  return (
    <StoreLayout>
      <ProductDetails data={data} />
      {!eventData && data && <SuggestedProduct data={data} />}
    </StoreLayout>
  );
};

export default ProductDetailsPage;
