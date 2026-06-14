import React, { useEffect, useState } from "react";
import ProductCard from "../Route/ProductCard/ProductCard";
import { useSelector } from "react-redux";
import { ui } from "../../styles/theme";

const SuggestedProduct = ({ data }) => {
  const [productData, setProductData] = useState(null);
  const { allProducts } = useSelector((state) => state.product);

  useEffect(() => {
    if (allProducts && data) {
      const d = allProducts.filter((i) => i.category === data.category);
      setProductData(d);
    }
  }, [allProducts, data]);

  return (
    <div>
      {data ? (
        <div className={`${ui.container} ${ui.section} p-4`}>
          <h2 className={`${ui.titleSm} border-b border-gray-200 pb-3 mb-6 capitalize`}>
            Related Products
          </h2>
          {productData && productData.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-8">
              {productData.map((i, index) => (
                <ProductCard data={i} key={index} />
              ))}
            </div>
          ) : (
            <div className={ui.empty}>No related products found</div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SuggestedProduct;