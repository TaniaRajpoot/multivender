import React, { useEffect, useState } from "react";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import { useSelector } from "react-redux";
import StoreLayout from "../components/ui/StoreLayout";
import SectionTitle from "../components/ui/SectionTitle";
import { ui } from "../styles/theme";

const BestSellingPage = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.product);

  useEffect(() => {
    const d = allProducts ? [...allProducts].sort((a, b) => (b.sold_out ?? b.soldOut ?? 0) - (a.sold_out ?? a.soldOut ?? 0)) : [];
    setData(d);
  }, [allProducts]);

  return (
    <StoreLayout activeHeading={2}>
      <div className={`${ui.container} ${ui.section}`}>
        <SectionTitle title="Best sellers" subtitle="Our most popular products." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((i, index) => (
            <ProductCard data={i} key={i._id || index} />
          ))}
        </div>
      </div>
    </StoreLayout>
  );
};

export default BestSellingPage;
