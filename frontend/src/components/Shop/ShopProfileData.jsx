import React, { useEffect, useState } from "react";
import ProductCard from "../Route/ProductCard/ProductCard";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { getAllEventsShop } from "../../redux/actions/event";
import Ratings from "../Products/Ratings";
import styles from "../../styles/styles";

const ShopProfileData = ({ isOwner }) => {
  const dispatch = useDispatch();
  const { id: paramId } = useParams();
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.product);
  const { events } = useSelector((state) => state.events);

  const shopId = paramId || seller?._id;

  // Helper function to get image URL
  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    
    // If it's an object with url property (Cloudinary format)
    if (typeof image === "object" && image.url) {
      return image.url;
    }
    
    // If it's already a URL string (starts with http)
    if (typeof image === "string" && image.startsWith("http")) {
      return image;
    }
    
    // Fallback for old backend format or relative paths
    return image;
  };

  useEffect(() => {
    if (shopId) {
      dispatch(getAllProductsShop(shopId));
      dispatch(getAllEventsShop(shopId));
    }
  }, [dispatch, shopId]);

  const allReviews = products ? products.map((p) => p.reviews || []).flat() : [];

  const [active, setActive] = useState(1);

  return (
    <div className="w-full">
      {/* Toggle Part */}
      <div className="flex w-full items-center justify-between pr-[20px]">
        <div className="w-full flex">
          <h5
            onClick={() => setActive(1)}
            className={`${active === 1 ? "text-red-500" : "text-[#333]"} font-[600] text-[20px] cursor-pointer mr-4`}
          >
            Shop Products
          </h5>
          <h5
            onClick={() => setActive(2)}
            className={`${active === 2 ? "text-red-500" : "text-[#333]"} font-[600] text-[20px] cursor-pointer mr-4`}
          >
            Running Events
          </h5>
          <h5
            onClick={() => setActive(3)}
            className={`${active === 3 ? "text-red-500" : "text-[#333]"} font-[600] text-[20px] cursor-pointer mr-4`}
          >
            Shop Reviews
          </h5>
        </div>

        <div>
          <Link to="/dashboard">
            <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
              <span className="text-[#fff] capitalize">Go to Dashboard</span>
            </div>
          </Link>
        </div>
      </div>

      <br />

      {/* Products */}
      {active === 1 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
          {products?.length > 0 ? (
            products.map((p) => <ProductCard key={p._id} data={p} isShop />)
          ) : (
            <h5 className="text-center py-5 text-[18px]">No products for this shop!</h5>
          )}
        </div>
      )}

      {/* Events */}
      {active === 2 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
          {events?.length > 0 ? (
            events.map((e) => <ProductCard key={e._id} data={e} isShop isEvent />)
          ) : (
            <h5 className="text-center py-5 text-[18px]">No events for this shop!</h5>
          )}
        </div>
      )}

      {/* Reviews */}
      {active === 3 && (
        <div className="w-full">
          {allReviews?.length > 0 ? (
            allReviews.map((r, index) => (
              <div className="flex my-4" key={index}>
                <img
                  src={getImageUrl(r.user.avatar)}
                  className="w-[50px] h-[50px] rounded-full object-cover"
                  alt={r.user.name}
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />
                <div className="pl-2">
                  <div className="flex items-center">
                    <h1 className="font-[600] pr-2">{r.user.name}</h1>
                    <Ratings rating={r.rating} />
                  </div>
                  <p className="text-[#000000a7]">{r.comment}</p>
                  <p className="text-[#000000a7] text-[14px]">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <h5 className="text-center py-5 text-[18px]">No reviews for this shop!</h5>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;