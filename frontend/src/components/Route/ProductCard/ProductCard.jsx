import React, { useState, useEffect } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import ProductCardDetails from "../ProductDetailsCard/ProductDetailsCard";
import { removeFromWishList, addToWishList } from "../../../redux/actions/wishlist";

const ProductCard = ({ data, isEvent }) => {
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(1);
  const [imgLoaded, setImgLoaded] = useState(false);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (wishlist && wishlist.find((item) => item._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data._id]);

  const getImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === "object" && image.url) return image.url;
    if (typeof image === "string" && image.startsWith("http")) return image;
    return image;
  };

  const imageUrl = getImageUrl(data.images?.[0]);

  const removeFromWishListHandler = (data) => {
    setClick(false);
    dispatch(removeFromWishList(data));
  };

  const addtoWishListHandler = (data) => {
    setClick(true);
    dispatch(addToWishList(data));
  };

  const addToCartHandler = () => {
    const isItemExist = cart.find((i) => i._id === data._id);
    if (isItemExist) {
      toast.error("Item already in cart");
    } else {
      if (data.stock < count) {
        toast.error("Not enough stock available");
      } else {
        dispatch(addToCart({ ...data, qty: count }));
        toast.success("Item added to cart successfully");
      }
    }
  };

  const discountPercent =
    data.originalPrice && data.originalPrice > data.discountPrice
      ? Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)
      : null;

  return (
    <>
      <div className="group relative w-full bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">

        {/* Image Area */}
        <div className="relative w-full h-52 overflow-hidden bg-gray-50">

          {/* Shimmer skeleton shown while image loads */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
          )}

          <Link to={isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={data.name}
                onLoad={() => setImgLoaded(true)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder.png";
                  setImgLoaded(true);
                }}
                className={`w-full h-52 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-95 ${
                  imgLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            ) : (
              <div className="w-full h-52 flex items-center justify-center bg-gray-100 text-gray-300 text-xs">
                No image
              </div>
            )}
          </Link>

          {/* Discount badge */}
          {discountPercent && (
            <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-orange-500 text-white text-[11px] font-bold rounded-lg shadow-md">
              -{discountPercent}%
            </div>
          )}

          {/* Wishlist Button */}
          <div className="absolute top-3 right-3 z-20">
            {click ? (
              <button
                onClick={() => removeFromWishListHandler(data)}
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-red-500 shadow-md hover:scale-110 transition-transform"
              >
                <AiFillHeart size={16} />
              </button>
            ) : (
              <button
                onClick={() => addtoWishListHandler(data)}
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-md hover:scale-110 hover:text-red-400 transition-all"
              >
                <AiOutlineHeart size={16} />
              </button>
            )}
          </div>

          {/* Hover Quick-Action Buttons — slide up from bottom */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 p-3 bg-gradient-to-t from-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
            <button
              onClick={() => setOpen(!open)}
              title="Quick view"
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-700 hover:bg-teal-700 hover:text-white shadow-lg transition-all duration-200 hover:scale-105"
            >
              <AiOutlineEye size={18} />
            </button>
            <button
              onClick={addToCartHandler}
              title="Add to cart"
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-700 hover:bg-teal-700 hover:text-white shadow-lg transition-all duration-200 hover:scale-105"
            >
              <AiOutlineShoppingCart size={18} />
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          {/* Shop name */}
          {data?.shop && (
            <Link to={`/shop/preview/${data.shop._id}`}>
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest hover:underline">
                {data.shop.name}
              </span>
            </Link>
          )}

          {/* Product name */}
          <Link to={isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}>
            <h4 className="text-[13px] font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-teal-700 transition-colors">
              {data.name}
            </h4>
          </Link>

          {/* Price Row */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-teal-800">
                ${data.discountPrice}
              </span>
              {data.originalPrice && data.originalPrice !== data.discountPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ${data.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-wide">
              {data?.sold_out ?? data?.soldOut ?? 0} sold
            </span>
          </div>
        </div>

        {open && <ProductCardDetails setOpen={setOpen} data={data} />}
      </div>
    </>
  );
};

export default ProductCard;