import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
import { Link, useNavigate } from "react-router-dom";
import {
  addToWishList,
  removeFromWishList,
} from "../../../redux/actions/wishlist";
import { ui } from "../../../styles/theme";
import axios from "axios";
import { server } from "../../../server";

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

  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data.shop._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      axios.post(`${server}/conversation/create-new-converation`, { groupTitle, userId, sellerId })
        .then((res) => { navigate(`/inbox?/${res.data.conversation._id}`); })
        .catch((error) => { toast.error(error.response?.data?.message || "Failed to create conversation"); });
    } else {
      toast.error("Please Login To Create A Conversation!");
    }
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

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-4 top-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
          onClick={() => setOpen(false)}
        >
          <RxCross1 size={16} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100">
          <img
            src={data.images?.[0]?.url || "/placeholder.png"}
            alt={data.name}
            className="max-h-[300px] md:max-h-[400px] object-contain"
          />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{data.name}</h2>
            <p className="text-sm text-gray-500 line-clamp-3">{data.description}</p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-gray-900">${data.discountPrice}</span>
            {data.originalPrice && (
              <span className="text-lg text-gray-400 line-through">${data.originalPrice}</span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-1 border border-gray-200">
              <button
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition font-medium"
                onClick={decrementCount}
              >
                -
              </button>
              <span className="w-8 text-center font-semibold text-gray-900">{count}</span>
              <button
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition font-medium"
                onClick={incrementCount}
              >
                +
              </button>
            </div>

            <button
              onClick={() => click ? removeFromWishlistHandler(data) : addToWishlistHandler(data)}
              className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              {click ? <AiFillHeart size={24} className="text-red-500" /> : <AiOutlineHeart size={24} />}
            </button>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            <button
              className={`${ui.btnPrimary} w-full py-3 text-base`}
              onClick={() => AddToCartHandler(data._id)}
            >
              <AiOutlineShoppingCart size={20} />
              Add to cart
            </button>
            <button
              className={`${ui.btnSecondary} w-full py-3 text-base`}
              onClick={handleMessageSubmit}
            >
              <AiOutlineMessage size={20} />
              Send Message
            </button>
          </div>

          {data.shop && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={data.shop.avatar?.url || "/placeholder.png"}
                  alt={data.shop.name}
                  className="w-12 h-12 rounded-full border border-gray-200 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    <Link to={`/shop/preview/${data.shop._id}`} className="hover:text-teal-600 transition">
                      {data.shop.name}
                    </Link>
                  </h4>
                  <p className="text-xs text-teal-600 font-medium">({data.ratings || 0} Ratings)</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Total Sold</p>
                <p className="font-semibold text-gray-900">{data.sold_out || 0}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductCardDetails;