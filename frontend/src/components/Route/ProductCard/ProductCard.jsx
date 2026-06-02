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
    if (!image) return "/placeholder.png";
    if (typeof image === "object" && image.url) {
      return image.url;
    }
    if (typeof image === "string" && image.startsWith("http")) {
      return image;
    }
    return image;
  };

  const removeFromWishListHandler = (data) => {
    setClick(false);
    dispatch(removeFromWishList(data));
  };

  const addtoWishListHandler = (data) => {
    setClick(true);
    dispatch(addToWishList(data));
  };

  const addToCartHandler = (id) => {
    const isItemExist = cart.find((i) => i._id === data._id);
    if (isItemExist) {
      toast.error("Item already in cart");
    } else {
      if (data.stock < count) {
        toast.error("Not enough stock available");
      } else {
        const cartItem = {
          ...data,
          qty: count,
        };
        dispatch(addToCart(cartItem));
        toast.success("Item added to cart successfully");
      }
    }
  };

  return (
    <>
      <div className="group relative w-full bg-white border border-gray-200 rounded-xl p-4 transition hover:shadow-md overflow-hidden flex flex-col justify-between">
        <div>
          {data?.discountPrice < data?.originalPrice && (
            <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded-md">
              Sale
            </div>
          )}
          <div className="relative w-full h-44 rounded-lg overflow-hidden mb-3 bg-gray-100">
            <Link
              to={isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}
            >
              <img
                src={getImageUrl(data.images?.[0])}
                alt={data.name}
                className="w-full h-full object-contain p-4 transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />
            </Link>

            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 bg-teal-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4 backdrop-blur-[1px]">
              <button
                onClick={() => setOpen(!open)}
                className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-teal-700 hover:bg-teal-700 hover:text-white transition-all transform translate-y-6 group-hover:translate-y-0 duration-500 shadow-xl shadow-black/5"
              >
                <AiOutlineEye size={20} />
              </button>
              <button
                onClick={() => addToCartHandler(data._id)}
                className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-teal-700 hover:bg-orange-500 hover:text-white transition-all transform translate-y-6 group-hover:translate-y-0 duration-500 delay-75 shadow-xl shadow-black/5"
              >
                <AiOutlineShoppingCart size={20} />
              </button>
            </div>

            {/* Wishlist Button */}
            <div className="absolute top-4 right-4 z-20">
              {click ? (
                <button
                  onClick={() => removeFromWishListHandler(data)}
                  className="w-10 h-10 bg-white border border-teal-700/5 rounded-full flex items-center justify-center text-red-500 shadow-md hover:scale-110 transition-all"
                >
                  <AiFillHeart size={18} />
                </button>
              ) : (
                <button
                  onClick={() => addtoWishListHandler(data)}
                  className="w-10 h-10 bg-white border border-teal-700/5 rounded-full flex items-center justify-center text-teal-700 shadow-md hover:scale-110 transition-all"
                >
                  <AiOutlineHeart size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col px-1">
            {data?.shop && (
              <Link to={`/shop/preview/${data.shop._id}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-[1px] bg-teal-600/30" />
                  <span className="text-[9px] font-bold text-teal-600 uppercase tracking-widest opacity-80">
                    {data.shop.name}
                  </span>
                </div>
              </Link>
            )}

            <div className="flex-1 flex flex-col">
              <Link
                to={isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}
                className="flex-1 flex flex-col"
              >
                <h4 className="text-[13px] font-semibold text-gray-800 leading-tight mb-2 line-clamp-2 min-h-[32px] group-hover:text-teal-700 transition-colors uppercase">
                  {data.name}
                </h4>
              </Link>
            </div>
          </div>
        </div>

        <div className="px-1 mt-auto">
          <Link
            to={isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}
          >
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-teal-800">
                  ${data.discountPrice}
                </span>
                {data.originalPrice && data.originalPrice !== data.discountPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ${data.originalPrice}
                  </span>
                )}
              </div>

              <div className="text-right">
                <span className="text-[9px] font-bold text-orange-500 uppercase tracking-wider">
                  {data?.sold_out ?? data?.soldOut ?? 0} SOLD
                </span>
              </div>
            </div>
          </Link>
        </div>

        {open && <ProductCardDetails setOpen={setOpen} data={data} />}
      </div>
    </>
  );
};

export default ProductCard;