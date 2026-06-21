import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/actions/cart";
import {
  addToWishList,
  removeFromWishList,
} from "../../redux/actions/wishlist";
import Ratings from "./Ratings";
import axios from "axios";
import { server } from "../../server";
import CountDown from "../Events/CountDown";
import { useSearchParams } from "react-router-dom";
import { ui } from "../../styles/theme";

const ProductDetails = ({ data }) => {
  const [searchParams] = useSearchParams();
  const isEvent = searchParams.get("isEvent");
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { products } = useSelector((state) => state.product);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const dispatch = useDispatch();

  const isEventConcluded = isEvent && (data?.Finish_Date || data?.FinishDate) && (new Date(data.Finish_Date || data.FinishDate) - new Date() <= 0);

  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    if (typeof image === "object" && image.url) return image.url;
    if (typeof image === "string" && image.startsWith("http")) return image;
    return image;
  };

  useEffect(() => {
    dispatch(getAllProductsShop(data && data?.shop._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
    window.scrollTo(0, 0);
  }, [dispatch, wishlist, data]);

  const incrementCount = () => setCount(count + 1);
  const decrementCount = () => { if (count > 1) setCount(count - 1); };

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishList(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishList(data));
  };

  const addToCartHandler = (id) => {
    if (isEventConcluded) {
      toast.error("This event has ended and is no longer available.");
      return;
    }
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item is already in the cart!");
    } else {
      if (data.stock < count) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  const totalReviewsLength = products?.length > 0 ? products.reduce((acc, product) => acc + (product?.reviews?.length || 0), 0) : 0;
  const totalRatings = products?.length > 0 ? products.reduce((acc, product) => acc + (product.reviews?.length > 0 ? product.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) : 0), 0) : 0;
  const averageRating = totalReviewsLength > 0 ? totalRatings / totalReviewsLength : 0;

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

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {data ? (
        <div className={ui.containerWide}>
          <div className="w-full py-8 md:py-12">
            <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
              {/* Left Side: Product Images */}
              <div className="w-full lg:w-1/2">
                <div className="sticky top-24">
                  <div className={`${ui.card} relative aspect-square overflow-hidden mb-4 group`}>
                    <img
                      src={getImageUrl(data.images?.[select])}
                      alt={data.name}
                      className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-teal-600 text-white px-3 py-1 rounded-md text-xs font-semibold shadow-sm uppercase tracking-wide">
                      New Arrival
                    </div>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {data.images.map((i, index) => (
                      <button
                        key={index}
                        onClick={() => setSelect(index)}
                        className={`relative h-20 w-20 min-w-[80px] rounded-lg overflow-hidden transition-all duration-300 border-2 ${select === index
                          ? "border-teal-600"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <img src={getImageUrl(i)} alt="" className="h-full w-full object-contain p-2" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Information */}
              <div className="w-full lg:w-1/2 flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-teal-600 uppercase tracking-wider">
                  <span>Shop</span>
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                  <span>{data.category}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">
                  {data.name}
                </h1>

                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-end gap-3">
                    <span className="text-3xl font-bold text-gray-900">${data.discountPrice}</span>
                    {data.originalPrice && (
                      <span className="text-lg text-gray-400 line-through font-medium pb-1">${data.originalPrice}</span>
                    )}
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="flex items-center gap-2">
                    <Ratings rating={data.ratings || 4.5} />
                    <span className="text-gray-600 font-medium text-sm">({data.reviews?.length || 0} Reviews)</span>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-8">
                  {data.description}
                </p>

                {isEvent && (
                  <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-xl relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Limited Time Event</p>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-100 pb-4 mb-4">
                      <div>
                        <p className="text-xs font-semibold text-red-500 uppercase">Starts</p>
                        <p className="text-sm font-bold text-gray-900">{data.start_Date ? new Date(data.start_Date).toLocaleDateString() : '01/01/2025'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-red-500 uppercase">Ends</p>
                        <p className="text-sm font-bold text-gray-900">{data.Finish_Date ? new Date(data.Finish_Date).toLocaleDateString() : '31/12/2025'}</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-xs font-bold text-red-500 uppercase mb-2">Time Remaining</p>
                      <CountDown data={data} isDeadline={true} />
                    </div>
                  </div>
                )}

                {/* Interaction Section */}
                <div className={`${ui.card} ${ui.cardPadding} mb-8`}>
                  <div className="flex flex-wrap items-center gap-6 mb-6">
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1">
                      <button
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition font-medium"
                        onClick={decrementCount}
                      > - </button>
                      <span className="w-12 text-center text-gray-900 font-semibold">{count}</span>
                      <button
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition font-medium"
                        onClick={incrementCount}
                      > + </button>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Only <span className="text-teal-600 font-semibold">{data.stock} units</span> left in stock</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {isEventConcluded ? (
                      <button
                        className={`${ui.btnPrimary} !bg-gray-400 !border-gray-400 opacity-50 cursor-not-allowed flex-1 py-3 text-base`}
                        disabled
                      >
                        Event Ended / Not Available
                      </button>
                    ) : (
                      <button
                        className={`${ui.btnPrimary} flex-1 py-3 text-base`}
                        onClick={() => addToCartHandler(data._id)}
                      >
                        <AiOutlineShoppingCart size={20} />
                        Add to cart
                      </button>
                    )}
                    <button
                      onClick={() => click ? removeFromWishlistHandler(data) : addToWishlistHandler(data)}
                      className="h-[46px] w-[46px] flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition sm:flex-none"
                    >
                      {click ? <AiFillHeart size={24} className="text-red-500" /> : <AiOutlineHeart size={24} className="text-gray-600" />}
                    </button>
                  </div>
                </div>

                {/* Seller Mini Card */}
                <div className={`${ui.card} flex items-center justify-between p-4 hover:border-teal-200 transition-colors`}>
                  <Link to={`/shop/preview/${data.shop?._id}`} className="flex items-center gap-4">
                    <img
                      className="w-14 h-14 rounded-full object-cover border border-gray-200"
                      src={getImageUrl(data?.shop?.avatar)}
                      alt={data?.shop?.name}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-base group-hover:text-teal-600">{data?.shop?.name}</h4>
                      <p className="text-xs font-medium text-gray-500">Store • {averageRating.toFixed(1)}/5 Stars</p>
                    </div>
                  </Link>
                  <button
                    onClick={handleMessageSubmit}
                    className="w-10 h-10 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center hover:bg-teal-100 transition-colors"
                  >
                    <AiOutlineMessage size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Detailed Info Tabs */}
            <ProductsDetailsInfo
              data={data}
              products={products}
              totalReviewsLength={totalReviewsLength}
              averageRating={averageRating}
              getImageUrl={getImageUrl}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

const ProductsDetailsInfo = ({ data, products, totalReviewsLength, averageRating, getImageUrl }) => {
  const [active, setActive] = useState(1);

  const tabs = [
    { id: 1, label: "Product Details" },
    { id: 2, label: "Product Reviews" },
    { id: 3, label: "Seller Information" },
  ];

  return (
    <div className="mt-16">
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`whitespace-nowrap py-4 px-6 text-sm font-semibold border-b-2 transition-colors ${active === tab.id
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[300px]">
        {active === 1 && (
          <div className={`${ui.card} ${ui.cardPadding} animate-in fade-in duration-300`}>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {data.description}
            </p>
          </div>
        )}

        {active === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            {data && data.reviews && data.reviews.length > 0 ? (
              data.reviews.map((item, index) => (
                <div className={`${ui.card} ${ui.cardPadding}`} key={index}>
                  <div className="flex items-center gap-4 mb-4">
                    <img src={getImageUrl(item.user.avatar)} alt="" className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{item.user?.name}</h4>
                      <Ratings rating={item?.rating} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm italic">"{item.comment}"</p>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-gray-500">
                No Reviews for this product yet.
              </div>
            )}
          </div>
        )}

        {active === 3 && (
          <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
            <div className={`${ui.card} w-full lg:w-1/3 p-6 flex flex-col items-center text-center`}>
              <img src={getImageUrl(data?.shop?.avatar)} alt="" className="w-24 h-24 rounded-full object-cover mb-4 border border-gray-200" />
              <h2 className="text-xl font-bold text-gray-900 mb-1">{data.shop.name}</h2>
              <p className="text-teal-600 text-sm font-medium mb-6">Verified Partner</p>
              <div className="w-full flex justify-between text-left text-sm mb-6 pb-6 border-b border-gray-100">
                <div className="text-gray-500">Joined On</div>
                <div className="font-semibold text-gray-900">{data.shop?.createdAt?.slice(0, 4)}</div>
              </div>
              <div className="w-full flex justify-between text-left text-sm mb-6 pb-6 border-b border-gray-100">
                <div className="text-gray-500">Products</div>
                <div className="font-semibold text-gray-900">{products?.length || 0}</div>
              </div>
              <div className="w-full flex justify-between text-left text-sm mb-6">
                <div className="text-gray-500">Avg Rating</div>
                <div className="font-semibold text-gray-900">{averageRating.toFixed(1)}/5</div>
              </div>
            </div>

            <div className={`${ui.card} w-full lg:w-2/3 p-6 lg:p-8 flex flex-col justify-center`}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">About the Shop</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                {data?.shop?.description || "This seller has not provided a description yet."}
              </p>
              <Link to={`/shop/preview/${data?.shop._id}`} className={ui.btnPrimary}>
                Visit Shop Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
