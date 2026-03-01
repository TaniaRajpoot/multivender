import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import { useSelector } from "react-redux";

const ProductsPage = () => {
  const [SearchParams] = useSearchParams();
  const { allProducts } = useSelector((state => state.product));
  const categoryData = SearchParams.get("category");
  const [data, setData] = useState([]);

  useEffect(() => {
    if (categoryData === null) {
      const d =
        allProducts && [...allProducts].sort((a, b) => a.sold_out - b.sold_out);
      setData(d);
    } else {
      const d =
        allProducts && [...allProducts].filter((i) => i.category === categoryData);
      setData(d);
    }
    window.scrollTo(0, 0);
  }, [allProducts, categoryData]);

  return (
    <div className="min-h-screen bg-[#EDE7E3]">
      <Header activeHeading={3} />

      {/* Page Header */}
      <div className="w-full bg-[#16697A] py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFA62B]/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-20 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-[700] text-white tracking-tight font-display italic">
            {categoryData ? categoryData : "Products"}
          </h1>
        </div>
      </div>

      {/* Product Grid Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="flex justify-between items-center mb-12 border-b border-[#16697A]/10 pb-8">
          <p className="text-[#16697A] font-[600] font-sans">
            Showing <span className="text-[#FFA62B]">{data ? data.length : 0}</span> results
          </p>
          <div className="flex gap-4">
            <select className="bg-white/50 backdrop-blur-md border border-[#16697A]/10 rounded-xl px-6 py-3 text-sm font-[600] text-[#16697A] focus:outline-none shadow-sm font-sans">
              <option>Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data &&
            data.map((i, index) => {
              return <ProductCard data={i} key={index} />;
            })}
        </div>

        {data && data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-32 h-32 bg-white/40 backdrop-blur-md rounded-[40px] flex items-center justify-center mb-8 shadow-soft">
              <svg className="w-16 h-16 text-[#16697A]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h1 className="text-2xl font-[700] text-[#16697A] mb-4 font-display italic">
              No products found!
            </h1>
            <p className="text-[#6B7280] font-[500] max-w-sm font-sans">
              We couldn't find any products in this category at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;