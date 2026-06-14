import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import { useSelector } from "react-redux";
import StoreLayout from "../components/ui/StoreLayout";
import { ui } from "../styles/theme";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const { allProducts } = useSelector((state) => state.product);
  const categoryData = searchParams.get("category");
  const [data, setData] = useState([]);
  const [sortType, setSortType] = useState("");

  useEffect(() => {
    let d = categoryData ? allProducts?.filter((i) => i.category === categoryData) || [] : [...(allProducts || [])];
    if (sortType === "Price: Low to High") d.sort((a, b) => a.discountPrice - b.discountPrice);
    else if (sortType === "Price: High to Low") d.sort((a, b) => b.discountPrice - a.discountPrice);
    else d.sort((a, b) => (b.sold_out ?? b.soldOut ?? 0) - (a.sold_out ?? a.soldOut ?? 0));
    setData(d);
    window.scrollTo(0, 0);
  }, [allProducts, categoryData, sortType]);

  return (
    <StoreLayout activeHeading={3}>
      <div className="bg-teal-800 text-white py-10">
        <div className={`${ui.container} text-center`}>
          <h1 className="text-3xl font-semibold">{categoryData || "All products"}</h1>
        </div>
      </div>
      <div className={`${ui.container} ${ui.section}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <strong>{data.length}</strong> products
          </p>
          <select value={sortType} onChange={(e) => setSortType(e.target.value)} className={ui.select + " w-full sm:w-48"}>
            <option value="">Most popular</option>
            <option value="Price: Low to High">Price: low to high</option>
            <option value="Price: High to Low">Price: high to low</option>
          </select>
        </div>
        {data.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.map((i, index) => (
              <ProductCard data={i} key={i._id || index} />
            ))}
          </div>
        ) : (
          <p className={ui.empty}>No products in this category.</p>
        )}
      </div>
    </StoreLayout>
  );
};

export default ProductsPage;
