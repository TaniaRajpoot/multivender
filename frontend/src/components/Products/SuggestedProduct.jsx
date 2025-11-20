import React, { useEffect, useState } from 'react';
import { productData } from '../../static/data';
import styles from '../../styles/styles';
import ProductCard from "../Route/ProductCard/ProductCard"

const SuggestedProduct = ({ data }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (data) {
      const d = productData.filter((item) => item.category === data.category);
      setProducts(d);
    }
  }, []);

  return (
    <div>
      {data && (
        <div className={`${styles.section} p-4`}>
          <h2 className={`${styles.heading} text-[25px] font-[500] border-b border-gray-200 mb-5`}>
            Related Products
          </h2>

          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 sm:gap-[30px] mb-12">
            {products.map((item, index) => (
              <ProductCard data={item} key={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestedProduct;
