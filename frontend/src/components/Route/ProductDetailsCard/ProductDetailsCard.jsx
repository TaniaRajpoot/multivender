import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { addToCart } from "../../../redux/actions/cart";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  addToWishList,
  removeFromWishList,
} from "../../../redux/actions/wishlist";

const ProductCardDetails = ({ setOpen, data }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data._id]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishList(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishList(data));
  };

  const handleMessageSubmit = () => {
    console.log("Done!");
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) setCount(count - 1);
  };

  const AddToCartHandler = (id) => {
    const isItemExist = cart.find((i) => i._id === id);
    if (isItemExist) {
      toast.error("Item already in cart");
    } else {
      if (data.stock < count) {
        toast.error("Not enough stock available");
      } else {
        const cartItem = { ...data, qty: count };
        dispatch(addToCart(cartItem));
        toast.success("Item added to cart successfully");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
      {/* Ethereal Glass Overlay */}
      <div
        className="absolute inset-0 bg-[#0c1a1d]/60 backdrop-blur-2xl transition-opacity duration-700"
        onClick={() => setOpen(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl bg-white/90 backdrop-blur-3xl rounded-[48px] shadow-[0_50px_100px_-20px_rgba(22,105,122,0.3)] overflow-hidden animate-in fade-in zoom-in-95 duration-700">

        {/* Close Button: Orbital Design */}
        <button
          className="absolute right-8 top-8 z-[100] w-14 h-14 rounded-full bg-white/50 border border-white hover:bg-white hover:text-[#FFA62B] text-[#16697A] backdrop-blur-md shadow-2xl flex items-center justify-center transition-all duration-500 hover:rotate-90 active:scale-90"
          onClick={() => setOpen(false)}
        >
          <RxCross1 size={22} weight="bold" />
        </button>

        <div className="flex flex-col md:flex-row h-full max-h-[92vh]">

          {/* Product Image */}
          <div className="w-full md:w-[45%] bg-[#EDE7E3]/40 p-8 lg:p-12 flex items-center justify-center relative overflow-hidden min-h-[300px] md:min-h-full">
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[#16697A]/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-[#FFA62B]/10 rounded-full blur-3xl animate-pulse delay-700" />

            <div className="relative group/immersion w-full h-full flex items-center justify-center p-4">
              <img
                src={data.images?.[0]?.url || "/placeholder.png"}
                alt={data.name}
                className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] group-hover/immersion:scale-105 transition-transform duration-1000 ease-out"
              />
              {/* Feature Badge */}
              <div className="absolute top-4 left-4 bg-[#16697A] text-white px-4 py-1.5 rounded-xl text-[9px] font-[700] uppercase tracking-[0.2em] shadow-2xl font-sans">
                New Arrival
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-[55%] p-10 md:p-16 lg:p-20 flex flex-col bg-white overflow-y-auto">

            <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#EDE7E3]">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-[0.3em] font-sans">
                  Category
                </span>
                <p className="text-[13px] font-[700] text-[#16697A] uppercase tracking-tight font-sans italic">
                  {data.category || "Product"}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#16697A]/5 px-4 py-2 rounded-2xl border border-[#16697A]/10">
                <span className="text-[#FFA62B] text-sm">★</span>
                <span className="text-[#16697A] text-sm font-[700] font-sans tracking-tight">{data.ratings || "4.9"}</span>
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-[700] text-[#16697A] leading-[0.9] tracking-tighter italic font-display mb-8">
              {data.name}
            </h1>

            <p className="text-[#16697A]/80 text-[15px] font-[500] leading-relaxed mb-10 font-sans border-l-2 border-[#FFA62B]/40 pl-6 py-2 max-w-[500px]">
              {data.description}
            </p>

            {/* Pricing */}
            <div className="flex items-baseline gap-6 mb-12">
              <span className="text-4xl font-[700] text-[#16697A] font-display italic tracking-tighter">
                ${data.discountPrice}
              </span>
              {data.price && (
                <span className="text-xl text-[#82C0CC] line-through font-[500] font-sans opacity-60">
                  ${data.price}
                </span>
              )}
            </div>

            {/* Interaction Layer */}
            <div className="flex flex-wrap items-center gap-8 mb-12">
              <div className="flex items-center bg-[#EDE7E3]/60 rounded-full p-2 border border-white gap-3 shadow-inner">
                <button
                  className="w-12 h-12 flex items-center justify-center text-[#16697A] hover:bg-white rounded-full transition-all text-xl font-[700] active:scale-90"
                  onClick={decrementCount}
                >
                  -
                </button>
                <span className="w-10 text-center text-[#16697A] font-[700] text-lg font-sans">{count}</span>
                <button
                  className="w-12 h-12 flex items-center justify-center text-[#16697A] hover:bg-white rounded-full transition-all text-xl font-[700] active:scale-90"
                  onClick={incrementCount}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => click ? removeFromWishlistHandler(data) : addToWishlistHandler(data)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-700 shadow-xl border ${click
                  ? "bg-[#FFA62B] text-white border-[#FFA62B]"
                  : "bg-white border-[#16697A]/10 text-[#16697A] hover:border-[#16697A] hover:shadow-[#16697A]/10 active:scale-95"
                  }`}
              >
                {click ? <AiFillHeart size={28} /> : <AiOutlineHeart size={28} />}
              </button>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <button
                className="group relative h-[72px] bg-[#16697A] text-white overflow-hidden rounded-full font-[700] text-[11px] uppercase tracking-[0.2em] font-sans transition-all duration-700 hover:shadow-[0_20px_40px_-10px_rgba(22,105,122,0.4)]"
                onClick={() => AddToCartHandler(data._id)}
              >
                <div className="absolute inset-0 bg-[#FFA62B] translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                <div className="relative flex items-center justify-center gap-3">
                  <AiOutlineShoppingCart size={22} />
                  <span>Add to cart</span>
                </div>
              </button>

              <button
                className="h-[72px] border-2 border-[#16697A]/20 text-[#16697A] rounded-full font-[700] text-[11px] uppercase tracking-[0.2em] font-sans hover:border-[#16697A] hover:bg-[#16697A] hover:text-white transition-all duration-700 flex items-center justify-center gap-3"
                onClick={handleMessageSubmit}
              >
                <AiOutlineMessage size={22} />
                <span>Send Message</span>
              </button>
            </div>

            {/* Entity Branding */}
            {data.shop && (
              <div className="mt-auto pt-10 border-t border-[#EDE7E3] flex items-center justify-between">
                <div className="flex items-center gap-5 group/shop cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-[#EDE7E3] border border-[#16697A]/10 flex items-center justify-center text-[#16697A] font-[700] text-lg font-display italic group-hover/shop:bg-[#16697A] group-hover:text-white transition-all duration-700">
                    {data.shop.name.charAt(0)}
                  </div>
                  <Link to={`/shop/preview/${data.shop._id}`}>
                    <div>
                      <h5 className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-[0.3em] mb-1 font-sans">Shop</h5>
                      <p className="text-xl font-[700] text-[#16697A] font-display italic tracking-tight uppercase group-hover/shop:text-[#FFA62B] transition-colors">{data.shop.name}</p>
                    </div>
                  </Link>
                </div>
                <div className="text-right">
                  <p className="text-[32px] font-[700] text-[#16697A]/10 font-display italic leading-none font-sans">{data.sold_out || "0"}</p>
                  <p className="text-[9px] font-[700] text-[#6B7280] uppercase tracking-[0.2em] mt-1 font-sans">Sold</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardDetails;