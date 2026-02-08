import React from "react";
import { RxCross1 } from "react-icons/rx";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { IoBagHandleOutline } from "react-icons/io5";
import styles from "../../../styles/styles";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";

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
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[90%] md:w-[45%] lg:w-[30%] bg-white flex flex-col overflow-hidden shadow-xl">
        {cart && cart.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-full flex justify-end pt-5 pr-5 absolute top-0 right-0">
              <RxCross1
                size={25}
                className="cursor-pointer hover:text-red-500 transition"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <IoBagHandleOutline size={80} className="text-gray-300 mb-4" />
            <h5 className="text-[20px] text-gray-500 font-medium">Your cart is empty!</h5>
            <p className="text-[14px] text-gray-400 mt-2">Add items to get started</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b bg-gray-600">
              <div className="flex items-center">
                <IoBagHandleOutline size={28} className="text-white" />
                <div className="ml-3">
                  <h5 className="text-[22px] font-semibold text-white">
                    Shopping Cart
                  </h5>
                  <p className="text-[13px] text-white/80">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <RxCross1
                size={25}
                className="cursor-pointer text-white hover:rotate-90 transition-transform duration-300"
                onClick={() => setOpenCart(false)}
              />
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {cart &&
                cart.map((item, index) => (
                  <CartSingle
                    key={index}
                    item={item}
                    qtyChangeHandler={qtyChangeHandler}
                    removeFromCartHandler={removeFromCartHandler}
                  />
                ))}
            </div>

            {/* Footer - Checkout */}
            <div className="border-t bg-gray-50 p-5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[16px] text-gray-600 font-medium">Total:</span>
                <span className="text-[24px] font-bold text-gray-800">US${totalPrice.toFixed(2)}</span>
              </div>
              <Link to="/checkout" onClick={() => setOpenCart(false)}>
                <button className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold text-[16px] hover:from-blue-600 hover:to-purple-700 transition shadow-lg">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ item, qtyChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(item.qty);
  const totalPrice = item.discountPrice * value;

  const increment = (item) => {
    if (item.stock < value + 1) {
      toast.error("Product stock limited!");
    } else {
      setValue(value + 1);
      const newData = {
        ...item,
        qty: value + 1,
      };
      qtyChangeHandler(newData);
    }
  };

  const decrement = (item) => {
    setValue(value === 1 ? 1 : value - 1);
    const newData = {
      ...item,
      qty: value === 1 ? 1 : value - 1,
    };
    qtyChangeHandler(newData);
  };

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

  return (
    <div className="border-b p-4 hover:bg-gray-50 transition-colors">
      <div className="w-full flex gap-4">
        {/* Product Image */}
        <div className="relative group">
          <img
            className="w-[110px] h-[110px] object-cover rounded-lg shadow-sm"
            src={getImageUrl(item.images && item.images[0])}
            alt={item.name}
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
          <div 
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 cursor-pointer hover:bg-red-600 transition shadow-md"
            onClick={() => removeFromCartHandler(item)}
          >
            <RxCross1 size={14} className="text-white" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="font-semibold text-[15px] text-gray-800 line-clamp-2 mb-1">
              {item.name}
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[18px] font-bold text-blue-600">
                ${item.discountPrice}
              </span>
              {item.originalPrice && item.originalPrice !== item.discountPrice && (
                <span className="text-[14px] text-gray-400 line-through">
                  ${item.originalPrice}
                </span>
              )}
            </div>
            {item.stock > 0 ? (
              <p className="text-[12px] text-green-600 font-medium">In Stock ({item.stock} available)</p>
            ) : (
              <p className="text-[12px] text-red-500 font-medium">Out of Stock</p>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 w-fit">
            <button
              className="w-7 h-7 rounded-md bg-white flex items-center justify-center cursor-pointer hover:bg-blue-500 hover:text-white transition shadow-sm"
              onClick={() => decrement(item)}
            >
              <HiOutlineMinus size={14} />
            </button>
            <span className="font-semibold text-[15px] min-w-[25px] text-center">{value}</span>
            <button
              className="w-7 h-7 rounded-md bg-white flex items-center justify-center cursor-pointer hover:bg-blue-500 hover:text-white transition shadow-sm"
              onClick={() => increment(item)}
            >
              <HiPlus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Total Price */}
      <div className="mt-3 pt-3 border-t flex justify-between items-center">
        <span className="text-[13px] text-gray-500">Subtotal:</span>
        <span className="text-[16px] font-bold text-gray-800">US${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Cart;