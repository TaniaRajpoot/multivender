import React, { useState } from 'react';
import { RxCross1 } from "react-icons/rx";
import { AiOutlineHeart } from "react-icons/ai";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styles from '../../styles/styles';
import { removeFromWishList } from "../../redux/actions/wishlist";
import { addToCart } from "../../redux/actions/cart";

const Wishlist = ({ setOpenWishList }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishList(data));
  };

  return (
    <div className='fixed top-0 left-0 w-full bg-[#0D3D47]/40 backdrop-blur-sm h-screen z-[100] transition-all duration-500'>
      <div className="fixed top-0 right-0 h-full w-[100%] sm:w-[500px] bg-white/95 backdrop-blur-2xl flex flex-col overflow-hidden shadow-2xl border-l border-white/50 animate-in slide-in-from-right duration-500">
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="w-full flex justify-end p-8 absolute top-0 right-0">
              <button
                onClick={() => setOpenWishList(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#EDE7E3] text-[#16697A] transition-all transform hover:rotate-90"
              >
                <RxCross1 size={20} />
              </button>
            </div>
            <div className="w-32 h-32 bg-[#EDE7E3] rounded-[48px] flex items-center justify-center mb-8 text-[#16697A]/10">
              <AiOutlineHeart size={48} />
            </div>
            <h3 className="text-2xl font-[700] text-[#16697A] mb-2 font-display italic">Empty Wishlist</h3>
            <p className="text-[#16697A]/40 font-medium max-w-[240px] text-sm font-sans">Save items you love for later. Explore our collection and build your dream selection.</p>
            <button
              onClick={() => setOpenWishList(false)}
              className="mt-8 px-10 py-4 bg-[#16697A] text-white font-[700] uppercase tracking-widest text-[12px] rounded-full hover:bg-[#FFA62B] transition-all duration-500 shadow-xl shadow-teal-900/10 font-sans"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-[#16697A]/10 bg-[#16697A]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/20">
                  <AiOutlineHeart size={24} />
                </div>
                <div>
                  <h5 className='text-xl font-[700] text-white tracking-tight font-display italic'>
                    My Wishlist
                  </h5>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] font-sans">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <button
                onClick={() => setOpenWishList(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-white transition-all transform hover:rotate-90"
              >
                <RxCross1 size={20} />
              </button>
            </div>

            {/* Wishlist items */}
            <div className='flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[#EDE7E3]/30'>
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
    <div className='relative group bg-white rounded-[32px] p-4 border border-[#16697A]/5 hover:shadow-soft transition-all duration-500'>
      <div className="w-full flex gap-4">
        {/* Product Image */}
        <div className="relative w-28 h-28 bg-[#EDE7E3]/20 rounded-2xl overflow-hidden flex items-center justify-center p-2 group-hover:scale-95 transition-transform duration-500">
          <img
            src={getImageUrl(data.images && data.images[0])}
            alt={data.name}
            className='max-w-full max-h-full object-contain mix-blend-multiply'
          />
          <button
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm shadow-sm rounded-lg p-1.5 cursor-pointer hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
            onClick={() => removeFromWishlistHandler(data)}
          >
            <RxCross1 size={12} />
          </button>
        </div>

        {/* Product Info */}
        <div className='flex-1 flex flex-col justify-between py-1'>
          <div>
            <h1 className="font-[700] text-[15px] text-[#16697A] leading-tight line-clamp-2 mb-2 font-sans">
              {data.name}
            </h1>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg font-[700] text-[#16697A] font-sans">
                ${data.discountPrice}
              </span>
              {data.originalPrice && data.originalPrice !== data.discountPrice && (
                <span className="text-xs font-bold text-[#16697A]/30 line-through">
                  ${data.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Quantity Controls & Add to Cart */}
          <div className="flex items-center justify-between">
            <div className="flex items-center bg-[#EDE7E3]/50 rounded-xl p-1 border border-white">
              <button
                className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#16697A] hover:bg-[#16697A] hover:text-white transition-all shadow-sm"
                onClick={() => decrement(data)}
              >
                <HiOutlineMinus size={12} />
              </button>
              <span className="font-[700] text-[13px] min-w-[25px] text-center text-[#16697A] font-sans">{value}</span>
              <button
                className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#16697A] hover:bg-[#16697A] hover:text-white transition-all shadow-sm"
                onClick={() => increment(data)}
              >
                <HiPlus size={12} />
              </button>
            </div>

            <button
              className="bg-[#16697A] text-white px-5 py-2.5 rounded-full text-[11px] font-[700] uppercase tracking-widest hover:bg-[#FFA62B] transition-all shadow-lg shadow-teal-900/5 disabled:opacity-50 font-sans"
              onClick={() => addToCartHandler(data._id)}
              disabled={data.stock === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Total Price */}
      <div className="mt-4 pt-4 border-t border-[#16697A]/5 flex justify-between items-center px-2">
        <span className="text-[10px] font-bold text-[#16697A]/30 uppercase tracking-[0.2em] font-sans">Subtotal:</span>
        <span className="text-[15px] font-[700] text-[#16697A] font-sans">US${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Wishlist;