import React, { useState } from 'react';
import { RxCross1 } from "react-icons/rx";
import { AiOutlineHeart } from "react-icons/ai";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ui } from '../../styles/theme';
import { removeFromWishList } from "../../redux/actions/wishlist";
import { addToCart } from "../../redux/actions/cart";

const Wishlist = ({ setOpenWishList }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishList(data));
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-slate-900/40 backdrop-blur-sm h-screen z-[100] transition-all duration-500">
      <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white flex flex-col overflow-hidden shadow-2xl border-l border-gray-200 animate-in slide-in-from-right duration-300">
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center relative">
            <div className="w-full flex justify-end p-6 absolute top-0 right-0">
              <button
                onClick={() => setOpenWishList(false)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-all transform hover:rotate-90"
              >
                <RxCross1 size={20} />
              </button>
            </div>
            <div className="w-24 h-24 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 text-teal-600">
              <AiOutlineHeart size={44} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 text-sm max-w-[280px]">Save items you love for later. Explore our collection and build your dream selection.</p>
            <button
              onClick={() => setOpenWishList(false)}
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-teal-700 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-800 transition"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-teal-700 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white border border-white/20">
                  <AiOutlineHeart size={20} />
                </div>
                <div>
                  <h5 className="text-lg font-bold">
                    My Wishlist
                  </h5>
                  <p className="text-xs text-white/80">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <button
                onClick={() => setOpenWishList(false)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-all transform hover:rotate-90"
              >
                <RxCross1 size={20} />
              </button>
            </div>

            {/* Wishlist items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {wishlist && wishlist.map((i, index) => (
                <WishlistSingle
                  key={index}
                  data={i}
                  removeFromWishlistHandler={removeFromWishlistHandler}
                  setOpenWishList={setOpenWishList}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const WishlistSingle = ({ data, removeFromWishlistHandler, setOpenWishList }) => {
  const [value, setValue] = useState(1);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const totalPrice = data.discountPrice * value;

  const increment = (data) => {
    if (data.stock < value + 1) {
      toast.error("Product stock limited!");
    } else {
      setValue(value + 1);
    }
  };

  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
  };

  const addToCartHandler = (id) => {
    const isItemExist = cart && cart.find((i) => i._id === id);

    if (isItemExist) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < value) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: value };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    if (typeof image === "object" && image.url) return image.url;
    if (typeof image === "string" && image.startsWith("http")) return image;
    return image;
  };

  return (
    <div className="relative bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-full flex gap-4">
        {/* Product Image */}
        <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-2 border border-gray-100 flex-shrink-0">
          <img
            src={getImageUrl(data.images && data.images[0])}
            alt={data.name}
            className="max-w-full max-h-full object-contain mix-blend-multiply"
          />
          <button
            className="absolute top-1 right-1 bg-white border border-gray-200 shadow-sm rounded-md p-1 hover:bg-red-50 hover:text-red-600 text-gray-400 transition"
            onClick={() => removeFromWishlistHandler(data)}
          >
            <RxCross1 size={10} />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between py-0.5">
          <div>
            <h1 className="font-semibold text-sm text-gray-800 leading-snug line-clamp-2 mb-1">
              {data.name}
            </h1>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-base font-bold text-teal-800">
                ${data.discountPrice}
              </span>
              {data.originalPrice && data.originalPrice !== data.discountPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ${data.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Quantity Controls & Add to Cart */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
              <button
                className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-teal-700 hover:bg-teal-700 hover:text-white transition shadow-sm"
                onClick={() => decrement(data)}
              >
                <HiOutlineMinus size={10} />
              </button>
              <span className="font-semibold text-xs min-w-[20px] text-center text-gray-700">{value}</span>
              <button
                className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-teal-700 hover:bg-teal-700 hover:text-white transition shadow-sm"
                onClick={() => increment(data)}
              >
                <HiPlus size={10} />
              </button>
            </div>

            <button
              className="bg-teal-700 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-teal-800 transition disabled:opacity-50"
              onClick={() => addToCartHandler(data._id)}
              disabled={data.stock === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Total Price */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center px-1">
        <span className="text-xs text-gray-500 font-medium">Subtotal:</span>
        <span className="text-sm font-bold text-gray-900">US${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Wishlist;