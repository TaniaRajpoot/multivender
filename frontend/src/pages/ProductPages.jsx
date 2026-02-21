import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/Route/ProductCard/ProductCard";
import { useSelector } from "react-redux";
const ProductsPage = () => {
  const [SearchParams] = useSearchParams();
  const {allProducts} = useSelector((state => state.product));
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
  }, [allProducts]);

  return (
    <div>
      <Header activeHeading={3} />
      <br />
      <br />
      <div className={`${styles.section}`}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
          {data &&
            data.map((i, index) => {
              return <ProductCard data={i} key={index} />;
            })}
          {data && data.length === 0 ? (
            <h1 className="text-center w-full capitalize pb-[100px] text-[20px]">
              No products found !
            </h1>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default ProductsPage;