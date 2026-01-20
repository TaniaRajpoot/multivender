import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { getAllProducts } from "../redux/actions/product";
import Loader from "../components/Layout/Loader";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [productData, setProductData] = useState(null);
  
  const { allProducts = [], isLoading = false } = useSelector((state) => state.product || {});
  
  useEffect(() => {
    // Always fetch all products
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    // Find the product when allProducts changes
    if (allProducts && allProducts.length > 0) {
      const product = allProducts.find((i) => i._id === id);
      setProductData(product);
      
      // Debug logs
      console.log("=== PRODUCT DETAILS PAGE DEBUG ===");
      console.log("Looking for ID:", id);
      console.log("Product found:", product);
      console.log("All products count:", allProducts.length);
      console.log("First product ID:", allProducts[0]?._id);
      console.log("================================");
    }
  }, [allProducts, id]);

  return (
    <div>
      <Header />
      {isLoading ? (
        <Loader />
      ) : productData ? (
        <>
          <ProductDetails data={productData} />
          <SuggestedProduct data={productData} />
        </>
      ) : (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-4">Product not found</p>
            <p className="text-gray-400 text-sm">Product ID: {id}</p>
            <p className="text-gray-400 text-sm">Check console for debug info</p>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;