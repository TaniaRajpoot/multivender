import React, { useEffect, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import { useSelector } from "react-redux";
import SectionTitle from "../../ui/SectionTitle";
import { ui } from "../../../styles/theme";

const BestDeals = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.product);

  useEffect(() => {
    const sorted = allProducts ? [...allProducts].sort((a, b) => (b.sold_out ?? b.soldOut ?? 0) - (a.sold_out ?? a.soldOut ?? 0)) : [];
    setData(sorted.slice(0, 5));
  }, [allProducts]);

  return (
    <section className={`${ui.section} bg-gray-50`}>
      <div className={ui.container}>
        <SectionTitle title="Best sellers" subtitle="Popular items other customers are buying." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {data?.length ? data.map((i, index) => <ProductCard data={i} key={index} />) : (
            <p className={ui.empty}>No products yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BestDeals;
