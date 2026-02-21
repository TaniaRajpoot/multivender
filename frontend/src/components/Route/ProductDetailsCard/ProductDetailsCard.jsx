import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { addToCart } from "../../../redux/actions/cart";
import { useDispatch, useSelector } from "react-redux";
import { backend_url } from "../../../server";
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
    <div className="bg-white">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="w-[90%] md:w-[70%] lg:w-[60%] h-[90vh] md:h-[75vh] bg-white rounded-md shadow-sm relative overflow-hidden">
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50 cursor-pointer hover:opacity-70"
              onClick={() => setOpen(false)}
            />
            
            {/* Scrollable Content */}
            <div className="w-full h-full overflow-y-scroll p-4 pt-12">
              {/* Main Container */}
              <div className="flex flex-col md:flex-row w-full gap-4">
                {/* Left Container */}
                <div className="w-full md:w-[50%]">
                  {/* Product Image */}
                  {data.images && data.images[0] && (
                    <div className="w-full h-[280px] md:h-80 mb-4 flex items-center justify-center bg-gray-50 rounded-md overflow-hidden">
                      <img
                        src={`${data.images[0].url}`}
                        alt={data.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  {/* Shop Info */}
                  {data.shop ? (
                    <div className="flex items-center mt-4">
                      {data.shop.avatar && (
                        <img
                          src={`${data.shop.avatar.url}`}
                          alt={data.shop.name}
                          className="w-[50px] h-[50px] rounded-full mr-2 object-cover"
                        />
                      )}
                      <div>
                        <Link to={`/shop/preview/${data.shop._id}`}>
                          <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                        </Link>
                        <h5 className="pb-3 text-[15px]">
                          ({data.shop.ratings || 0}) Ratings
                        </h5>
                      </div>
                    </div>
                  ) : null}

                  {/* Send Message Button */}
                  <button
                    className={`${styles.button} bg-[#000000] mt-4 rounded-sm h-11 w-full cursor-pointer flex items-center justify-center`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-white flex items-center">
                      Send Message <AiOutlineMessage className="ml-1" />
                    </span>
                  </button>

                  {/* Sold Out Info */}
                  <h5 className="text-[16px] text-red-600 mt-5">
                    {data?.soldOut || 0} sold out
                  </h5>
                </div>

                {/* Right Container */}
                <div className="w-full md:w-[50%]">
                  <h1 className={`${styles.productTitle} text-[20px]`}>
                    {data.name}
                  </h1>
                  <p className="mt-2 text-gray-600 text-[15px]">{data.description}</p>

                  {/* Price */}
                  <div className="flex items-center pt-3 gap-2">
                    <h4 className={`${styles.productDiscountPrice}`}>
                      ${data.discountPrice}
                    </h4>
                    <h3 className={`${styles.price}`}>
                      {data.price ? "$" + data.price : null}
                    </h3>
                  </div>

                  {/* Quantity Handler */}
                  <div className="flex items-center mt-8 justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-linear-to-r from-teal-400 to-teal-500 text-white font-bold rounded-md px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                        onClick={decrementCount}
                      >
                        -
                      </button>
                      <span className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium min-w-[50px] text-center">
                        {count}
                      </span>
                      <button
                        className="bg-linear-to-r from-teal-400 to-teal-500 text-white font-bold rounded-md px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                        onClick={incrementCount}
                      >
                        +
                      </button>
                    </div>

                    {/* Heart icon */}
                    <div>
                      {click ? (
                        <AiFillHeart
                          size={25}
                          className="cursor-pointer"
                          onClick={() => removeFromWishlistHandler(data)}
                          color="red"
                          title="Remove from wishlist"
                        />
                      ) : (
                        <AiOutlineHeart
                          size={25}
                          className="cursor-pointer"
                          onClick={() => addToWishlistHandler(data)}
                          title="Add to wishlist"
                        />
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    className={`${styles.button} mt-6 rounded-sm h-11 w-full cursor-pointer flex items-center justify-center`}
                    onClick={() => AddToCartHandler(data._id)}
                  >
                    <span className="text-white flex items-center">
                      Add to Cart <AiOutlineShoppingCart className="ml-1" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductCardDetails;