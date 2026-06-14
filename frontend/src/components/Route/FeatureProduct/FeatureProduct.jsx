import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../ProductCard/ProductCard";
import { getAllProducts } from "../../../redux/actions/product";
import SectionTitle from "../../ui/SectionTitle";
import { ui } from "../../../styles/theme";

const FeatureProduct = () => {
  const dispatch = useDispatch();
  const { allProducts, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  return (
    <section className={`${ui.section} bg-white`}>
      <div className={ui.container}>
        <SectionTitle title="All products" subtitle="Everything available in our marketplace right now." />
        {isLoading ? (
          <p className={ui.empty}>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allProducts?.length ? (
              allProducts.map((product, index) => (
                <ProductCard data={product} key={product._id || index} />
              ))
            ) : (
              <p className={`${ui.empty} col-span-full`}>No products found.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureProduct;
