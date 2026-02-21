import React from "react";
import styles from "../../styles/styles";
import CountDown from "./CountDown";
import { backend_url } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/actions/cart";
import { Link } from "react-router-dom";

const EventCard = ({ active, data }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  
  const addToCartHandler = (product) => {
    const isItemExists = cart && cart.find((i) => i._id === product._id);
    if (isItemExists) {
      toast.error("Item is already in the cart!");
    } else {
      if (product.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...product, qty: 1 };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <div
      className={`w-full bg-white ${
        active ? "unset" : "mb-12"
      } rounded-lg lg:flex p-6 gap-8`}
    >
      {/* Image Container */}
      <div className="w-full lg:w-[40%] flex items-center justify-center">
        <div className="w-full max-w-[400px] h-[300px] lg:h-[400px] flex items-center justify-center">
          <img
            src={`${data.images[0]?.url}`}
            alt={data?.name}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="w-full lg:w-[60%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle} text-[24px] lg:text-[28px] font-semibold mb-3`}>
          {data?.name}
        </h2>
        
        <p className="text-[15px] lg:text-[16px] text-gray-600 leading-relaxed mb-4 line-clamp-3">
          {data?.description}
        </p>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h5 className="font-medium text-[18px] lg:text-[20px] text-[#d55b45] line-through">
              {data.originalPrice}$
            </h5>
            <h5 className="font-bold text-[22px] lg:text-[26px] text-[#333] font-Roboto">
              {data.discountPrice}$
            </h5>
          </div>
          <span className="font-normal text-[16px] lg:text-[17px] text-[#44a55e]">
            120 Sold
          </span>
        </div>

        {/* Countdown */}
        <div className="mb-6">
          <CountDown data={data} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 flex-wrap">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <button className={`${styles.button} text-white px-8 py-3 rounded-md`}>
              See Details
            </button>
          </Link>
          <button
            className={`${styles.button} text-white px-8 py-3 rounded-md`}
            onClick={() => addToCartHandler(data)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;