import React, { useEffect, useState } from "react";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";
import { useSelector } from "react-redux";

const BestDeals = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.product);

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a, b) => b.sold_out - a.sold_out);
    const firstFive = sortedData && sortedData.slice(0, 5);
    setData(firstFive);
  }, [allProducts]);

  return (
    <div className="py-10 bg-[#EDE7E3]">
      <div className={`${styles.section}`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="relative">
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#FFA62B] rounded-full" />
            <span className="text-[11px] font-[700] text-[#FFA62B] uppercase tracking-[0.4em] mb-3 block font-sans">Best Deals</span>
            <h2 className="text-3xl md:text-5xl font-[700] text-[#16697A] tracking-tighter italic font-display">
              Best <span className="text-[#489FB5]">Deals</span>
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-12">
          {data && data.length !== 0 && (
            <>
              {data &&
                data.map((i, index) => <ProductCard data={i} key={index} />)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestDeals;