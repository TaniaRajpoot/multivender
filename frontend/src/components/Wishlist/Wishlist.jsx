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
    <div className='fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10'>
      <div className="fixed top-0 right-0 h-full w-[90%] md:w-[45%] lg:w-[30%] bg-white flex flex-col overflow-hidden shadow-xl">
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-full flex justify-end pt-5 pr-5 absolute top-0 right-0">
              <RxCross1
                size={25}
                className="cursor-pointer hover:text-red-500 transition"
                onClick={() => setOpenWishList(false)}
              />
            </div>
            <AiOutlineHeart size={80} className="text-gray-300 mb-4" />
            <h5 className="text-[20px] text-gray-500 font-medium">Your wishlist is empty!</h5>
            <p className="text-[14px] text-gray-400 mt-2">Save items you love for later</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b bg-gray-600">
              <div className="flex items-center">
                <AiOutlineHeart size={28} className="text-white" />
                <div className="ml-3">
                  <h5 className='text-[22px] font-semibold text-white'>
                    My Wishlist
                  </h5>
                  <p className="text-[13px] text-white/80">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <RxCross1 
                size={25} 
                className="cursor-pointer text-white hover:rotate-90 transition-transform duration-300" 
                onClick={() => setOpenWishList(false)} 
              />
            </div>

            {/* Wishlist items */}
            <div className='flex-1 overflow-y-auto'>
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
    if (typeof image === "object" && image.url) {
      return image.url;
    }
    if (typeof image === "string" && image.startsWith("http")) {
      return image;
    }
    return image;
  };

  return (
    <div className='border-b p-4 hover:bg-gray-50 transition-colors'>
      <div className="w-full flex gap-4">
        {/* Product Image */}
        <div className="relative group">
          <img
            src={getImageUrl(data.images && data.images[0])}
            alt={data.name}
            className='w-[110px] h-[110px] object-cover rounded-lg shadow-sm'
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
          <div 
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 cursor-pointer hover:bg-red-600 transition shadow-md"
            onClick={() => removeFromWishlistHandler(data)}
          >
            <RxCross1 size={14} className="text-white" />
          </div>
        </div>

        {/* Product Info */}
        <div className='flex-1 flex flex-col justify-between'>
          <div>
            <h1 className="font-semibold text-[15px] text-gray-800 line-clamp-2 mb-1">
              {data.name}
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[18px] font-bold text-red-500">
                ${data.discountPrice}
              </span>
              {data.originalPrice && data.originalPrice !== data.discountPrice && (
                <span className="text-[14px] text-gray-400 line-through">
                  ${data.originalPrice}
                </span>
              )}
            </div>
            {data.stock > 0 ? (
              <p className="text-[12px] text-green-600 font-medium">In Stock ({data.stock} available)</p>
            ) : (
              <p className="text-[12px] text-red-500 font-medium">Out of Stock</p>
            )}
          </div>

          {/* Quantity Controls & Add to Cart */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                className="w-7 h-7 rounded-md bg-white flex items-center justify-center cursor-pointer hover:bg-red-500 hover:text-white transition shadow-sm"
                onClick={() => decrement(data)}
              >
                <HiOutlineMinus size={14} />
              </button>
              <span className="font-semibold text-[15px] min-w-[25px] text-center">{value}</span>
              <button
                className="w-7 h-7 rounded-md bg-white flex items-center justify-center cursor-pointer hover:bg-red-500 hover:text-white transition shadow-sm"
                onClick={() => increment(data)}
              >
                <HiPlus size={14} />
              </button>
            </div>

            <button 
              className="bg-gray-600 text-white px-4 py-2 rounded-lg text-[13px] font-semibold hover:from-pink-600 hover:to-red-600 transition shadow-md"
              onClick={() => addToCartHandler(data._id)}
              disabled={data.stock === 0}
            >
              Add to Cart
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

export default Wishlist;