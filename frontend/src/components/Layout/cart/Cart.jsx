import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { IoBagHandleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import { ui } from "../../../styles/theme";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);

  return (
    <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setOpenCart(false)}>
      <div
        className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center text-white">
              <IoBagHandleOutline size={22} />
            </div>
            <div>
              <h5 className="text-lg font-semibold text-gray-900">Your cart</h5>
              <p className="text-xs text-gray-500">{cart?.length || 0} items</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpenCart(false)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Close cart"
          >
            <RxCross1 size={20} />
          </button>
        </div>

        {cart?.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <IoBagHandleOutline size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Cart is empty</h3>
            <p className="text-sm text-gray-500 mt-2">Browse products and add items to checkout.</p>
            <button type="button" onClick={() => setOpenCart(false)} className={`${ui.btnPrimary} mt-6`}>
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item, index) => (
                <CartItem
                  key={index}
                  item={item}
                  qtyChangeHandler={(data) => dispatch(addToCart(data))}
                  removeFromCartHandler={(data) => dispatch(removeFromCart(data))}
                />
              ))}
            </div>
            <div className="p-5 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 mb-4">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <Link to="/checkout" onClick={() => setOpenCart(false)} className={`${ui.btnPrimary} w-full`}>
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartItem = ({ item, qtyChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(item.qty);

  const increment = () => {
    if (item.stock < value + 1) {
      toast.error("Not enough stock");
      return;
    }
    const newValue = value + 1;
    setValue(newValue);
    qtyChangeHandler({ ...item, qty: newValue });
  };

  const decrement = () => {
    if (value <= 1) return;
    const newValue = value - 1;
    setValue(newValue);
    qtyChangeHandler({ ...item, qty: newValue });
  };

  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    if (typeof image === "object" && image.url) return image.url;
    if (typeof image === "string" && image.startsWith("http")) return image;
    return image;
  };

  return (
    <div className="flex gap-3 p-3 rounded-xl border border-gray-200 bg-white group">
      <img
        src={getImageUrl(item.images?.[0])}
        alt={item.name}
        className="w-20 h-20 object-contain rounded-lg bg-gray-50"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h4>
          <button
            type="button"
            onClick={() => removeFromCartHandler(item)}
            className="text-gray-400 hover:text-red-600 shrink-0"
          >
            <RxCross1 size={14} />
          </button>
        </div>
        <p className="text-sm font-semibold text-teal-800 mt-1">${item.discountPrice}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button type="button" onClick={decrement} className="p-1.5 hover:bg-gray-100">
              <HiOutlineMinus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-medium">{value}</span>
            <button type="button" onClick={increment} className="p-1.5 hover:bg-gray-100">
              <HiPlus size={14} />
            </button>
          </div>
          <span className="text-xs text-gray-500">${(item.discountPrice * value).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Cart;
