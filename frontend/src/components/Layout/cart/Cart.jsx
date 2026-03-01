import React from "react";
import { RxCross1 } from "react-icons/rx";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { IoBagHandleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import { useState } from "react";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const qtyChangeHandler = (data) => {
    dispatch(addToCart(data));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0F4D58]/40 backdrop-blur-sm h-screen z-50 transition-all duration-500">
      <div className="fixed top-0 right-0 h-full w-[100%] sm:w-[500px] bg-white/90 backdrop-blur-2xl flex flex-col overflow-hidden shadow-2xl border-l border-white/50 animate-in slide-in-from-right duration-500">

        {/* Header Section */}
        <div className="flex items-center justify-between p-8 border-b border-[#16697A]/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#16697A] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <IoBagHandleOutline size={24} />
            </div>
            <div>
              <h5 className="text-xl font-[700] text-[#16697A] tracking-tight font-display italic">Shopping Cart</h5>
              <p className="text-[10px] font-bold text-[#489FB5] uppercase tracking-[0.2em] font-sans">{cart?.length || 0} Items</p>
            </div>
          </div>
          <button
            onClick={() => setOpenCart(false)}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#EDE7E3] text-[#16697A] transition-all transform hover:rotate-90"
          >
            <RxCross1 size={20} />
          </button>
        </div>

        {cart && cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-32 h-32 bg-[#EDE7E3] rounded-[48px] flex items-center justify-center mb-8 text-[#16697A]/20">
              <IoBagHandleOutline size={48} />
            </div>
            <h3 className="text-2xl font-[700] text-[#16697A] mb-2 font-display italic">Your Cart is Empty</h3>
            <p className="text-[#16697A]/40 font-medium max-w-[240px] text-sm font-sans">Explore our premium selection and find something special for yourself.</p>
            <button
              onClick={() => setOpenCart(false)}
              className="mt-8 px-8 py-4 bg-[#16697A] text-[#EDE7E3] font-[700] rounded-2xl hover:bg-[#FFA62B] transition-all duration-500 shadow-xl font-sans uppercase tracking-[0.1em] text-[13px]"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable Items Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {cart &&
                cart.map((item, index) => (
                  <CartItem
                    key={index}
                    item={item}
                    qtyChangeHandler={qtyChangeHandler}
                    removeFromCartHandler={removeFromCartHandler}
                  />
                ))}
            </div>

            {/* Summary & Checkout Footer */}
            <div className="p-8 bg-white border-t border-[#16697A]/10 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-[#16697A]/40 font-bold font-sans">
                  <span className="text-[10px] uppercase tracking-[0.2em]">Subtotal</span>
                  <span className="text-sm">US${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[#16697A]">
                  <span className="text-lg font-[700] font-display italic">Total Price</span>
                  <span className="text-2xl font-[700] font-display italic">US${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" onClick={() => setOpenCart(false)}>
                <button className="group relative w-full h-20 flex items-center justify-center bg-[#16697A] text-[#EDE7E3] font-[700] text-lg rounded-[28px] hover:bg-[#FFA62B] transition-all duration-500 shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center gap-3 font-sans font-[700] uppercase tracking-widest text-[13px]">
                    Checkout Now
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>
              </Link>
              <p className="text-center mt-6 text-[10px] font-[700] text-[#9CA3AF] uppercase tracking-[0.2em] font-sans">Secure encrypted transaction</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartItem = ({ item, qtyChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(item.qty);

  const increment = (item) => {
    if (item.stock < value + 1) {
      toast.error("Exceeds Available Stock");
    } else {
      const newValue = value + 1;
      setValue(newValue);
      qtyChangeHandler({ ...item, qty: newValue });
    }
  };

  const decrement = (item) => {
    if (value > 1) {
      const newValue = value - 1;
      setValue(newValue);
      qtyChangeHandler({ ...item, qty: newValue });
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    if (typeof image === "object" && image.url) return image.url;
    if (typeof image === "string" && image.startsWith("http")) return image;
    return image;
  };

  return (
    <div className="relative group bg-[#EDE7E3]/50 backdrop-blur-md rounded-[32px] p-4 border border-white hover:bg-white hover:shadow-soft transition-all duration-500">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative w-28 h-28 bg-white rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-2 group-hover:scale-95 transition-transform duration-500">
          <img
            src={getImageUrl(item.images && item.images[0])}
            alt={item.name}
            className="max-w-full max-h-full object-contain mix-blend-multiply"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex justify-between items-start">
              <h4 className="text-[15px] font-[700] text-[#16697A] leading-tight line-clamp-2 pr-6 font-sans">
                {item.name}
              </h4>
              <button
                onClick={() => removeFromCartHandler(item)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
              >
                <RxCross1 size={14} />
              </button>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-lg font-[700] text-[#16697A] font-sans">${item.discountPrice}</span>
              {item.originalPrice && (
                <span className="text-xs font-[600] text-[#9CA3AF] line-through font-sans">${item.originalPrice}</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Quantity */}
            <div className="flex items-center bg-white rounded-xl p-1 shadow-soft border border-[#16697A]/5">
              <button
                onClick={() => decrement(item)}
                className="w-8 h-8 flex items-center justify-center text-[#16697A] hover:bg-[#EDE7E3] rounded-lg transition-all font-[700]"
              >
                <HiOutlineMinus size={14} />
              </button>
              <span className="w-10 text-center text-[#16697A] font-[700] text-sm font-sans">{value}</span>
              <button
                onClick={() => increment(item)}
                className="w-8 h-8 flex items-center justify-center text-[#16697A] hover:bg-[#EDE7E3] rounded-lg transition-all font-[700]"
              >
                <HiPlus size={14} />
              </button>
            </div>

            <span className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-widest bg-[#82C0CC]/10 px-2 py-1 rounded-md font-sans">
              Total: ${(item.discountPrice * value).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;