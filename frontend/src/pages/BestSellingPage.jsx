import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import { useSelector } from "react-redux";

const BestSelling = () => {
  const [data, setData] = useState([]);
  const { allProducts, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    const d = allProducts && [...allProducts].sort((a, b) => b.sold_out - a.sold_out);
    setData(d);
  }, [allProducts]);

  return (
    <div className="bg-[#EDE7E3] min-h-screen font-Inter">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header activeHeading={2} />

          <div className="max-w-[1400px] mx-auto pt-20 pb-20 px-4 md:px-8">
            <div className="text-center mb-16 animate-in slide-in-from-top-8 duration-700">
              <h2 className="text-3xl md:text-5xl font-[700] text-[#16697A] tracking-tighter leading-none italic font-display">Best Selling</h2>
            </div>

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
            </div>

            {data && data.length === 0 && (
              <div className="h-[40vh] flex flex-col items-center justify-center text-center p-12 bg-white/40 backdrop-blur-xl rounded-[48px] border border-white">
                <h2 className="text-2xl font-[700] text-[#16697A] font-display italic">No products found!</h2>
              </div>
            )}
          </div>

          <Footer />
        </>
      )}
    </div>
  );
};

export default BestSelling;