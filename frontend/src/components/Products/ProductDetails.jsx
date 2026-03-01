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

const ProductDetails = ({ data }) => {
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { products } = useSelector((state) => state.product);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const dispatch = useDispatch();

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
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      axios.post(`${server}/conversation/create-new-converation`, { groupTitle, userId, sellerId })
        .then((res) => { navigate(`/inbox?/${res.data.conversation._id}`); })
        .catch((error) => { toast.error(error.response.data?.message); });
    } else {
      toast.error("Please Login To Create A Conversation!");
    }
  };

  return (
    <div className="bg-[#EDE7E3] min-h-screen pb-10">
      {data ? (
        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24">
          <div className="w-full py-8 md:py-16">
            <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
              {/* Left Side: Professional Image Gallery */}
              <div className="w-full lg:w-1/2">
                <div className="sticky top-24">
                  <div className="relative aspect-square w-full bg-white/40 backdrop-blur-md rounded-[48px] overflow-hidden shadow-soft group">
                    <img
                      src={getImageUrl(data.images?.[select])}
                      alt={data.name}
                      className="w-full h-full object-contain p-12 mix-blend-multiply group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-8 left-8 bg-[#FFA62B] text-white px-5 py-2 rounded-2xl text-[10px] font-[700] shadow-xl uppercase tracking-widest font-sans">
                      New Arrival
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8 px-2 overflow-x-auto pb-4 scrollbar-hide">
                    {data.images.map((i, index) => (
                      <button
                        key={index}
                        onClick={() => setSelect(index)}
                        className={`relative h-24 w-24 min-w-[96px] rounded-3xl overflow-hidden transition-all duration-300 ${select === index
                          ? "ring-4 ring-[#16697A] ring-offset-4 ring-offset-[#EDE7E3] scale-105"
                          : "opacity-60 hover:opacity-100 hover:scale-105"
                          }`}
                      >
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
                        <img src={getImageUrl(i)} alt="" className="h-full w-full object-contain mix-blend-multiply p-2" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Information & Interactions */}
              <div className="w-full lg:w-1/2 flex flex-col pt-4">
                <div className="flex items-center gap-2 mb-6 uppercase tracking-[0.3em] font-black text-[#489FB5] text-xs">
                  <span>Shop</span>
                  <span className="w-1 h-1 bg-[#FFA62B] rounded-full" />
                  <span>{data.category}</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-[700] text-[#16697A] leading-tight mb-6 font-display italic">
                  {data.name}
                </h1>

                <div className="flex items-center gap-8 mb-10">
                  <div className="flex flex-col">
                    <span className="text-4xl font-black text-[#16697A]">${data.discountPrice}</span>
                    {data.originalPrice && (
                      <span className="text-[#9CA3AF] line-through font-bold mt-1">${data.originalPrice}</span>
                    )}
                  </div>
                  <div className="h-12 w-[1px] bg-[#16697A]/10" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <Ratings rating={data.ratings || 4.5} />
                      <span className="text-[#16697A] font-[600] text-sm ml-2 font-sans">({data.reviews?.length || 0})</span>
                    </div>
                  </div>
                </div>

                <p className="text-[#6B7280] text-lg leading-relaxed mb-10 font-medium">
                  {data.description}
                </p>

                {/* Interaction Section */}
                <div className="bg-white/40 backdrop-blur-md border border-white rounded-[40px] p-8 md:p-10 mb-12 shadow-soft">
                  <div className="flex flex-wrap items-center gap-6 mb-8">
                    <div className="flex items-center bg-[#EDE7E3] p-1.5 rounded-2xl shadow-inner border border-white/50">
                      <button
                        className="w-12 h-12 flex items-center justify-center text-[#16697A] hover:bg-white hover:rounded-xl hover:shadow-soft transition-all text-xl font-black"
                        onClick={decrementCount}
                      > - </button>
                      <span className="w-16 text-center text-[#16697A] font-black text-lg">{count}</span>
                      <button
                        className="w-12 h-12 flex items-center justify-center text-[#16697A] hover:bg-white hover:rounded-xl hover:shadow-soft transition-all text-xl font-black"
                        onClick={incrementCount}
                      > + </button>
                    </div>
                    <p className="text-[#6B7280] text-sm font-bold italic ml-2">Only <span className="text-[#FFA62B]">{data.stock} units</span> left in stock</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      className="flex-1 h-20 flex items-center justify-center gap-4 bg-[#16697A] text-[#EDE7E3] font-[700] text-lg rounded-3xl hover:bg-[#FFA62B] transition-all duration-500 shadow-xl hover:shadow-[#FFA62B]/20 transform hover:-translate-y-1 font-sans uppercase tracking-widest text-sm"
                      onClick={() => addToCartHandler(data._id)}
                    >
                      <AiOutlineShoppingCart size={24} />
                      <span>Add to cart</span>
                    </button>
                    <button
                      onClick={() => click ? removeFromWishlistHandler(data) : addToWishlistHandler(data)}
                      className={`h-20 w-20 flex items-center justify-center rounded-3xl transition-all duration-500 shadow-xl transform hover:-translate-y-1 ${click ? "bg-[#FFA62B] text-white" : "bg-white text-[#16697A] hover:text-[#FFA62B]"
                        }`}
                    >
                      {click ? <AiFillHeart size={28} /> : <AiOutlineHeart size={28} />}
                    </button>
                  </div>
                </div>

                {/* Seller Mini Card */}
                <div className="flex items-center justify-between p-6 bg-white/20 rounded-[32px] border border-white/40 group hover:bg-white/40 transition-all duration-500">
                  <Link to={`/shop/preview/${data.shop?._id}`} className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white"
                        src={getImageUrl(data?.shop?.avatar)}
                        alt={data?.shop?.name}
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                    </div>
                    <div>
                      <h4 className="font-[700] text-[#16697A] text-lg group-hover:text-[#489FB5] transition-colors">{data?.shop?.name}</h4>
                      <p className="text-xs font-[600] text-[#6B7280] font-sans">Store • {averageRating.toFixed(1)}/5 Stars</p>
                    </div>
                  </Link>
                  <button
                    onClick={handleMessageSubmit}
                    className="w-14 h-14 bg-[#16697A] text-white rounded-2xl flex items-center justify-center hover:bg-[#489FB5] transition-all shadow-lg"
                  >
                    <AiOutlineMessage size={24} />
                  </button>
                </div>
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
      ) : null}
    </div>
  );
};

const ProductsDetailsInfo = ({ data, products, totalReviewsLength, averageRating, getImageUrl }) => {
  const [active, setActive] = useState(1);

  const tabs = [
    { id: 1, label: "Product Details" },
    { id: 2, label: `Product Reviews` },
    { id: 3, label: "Seller Information" },
  ];

  return (
    <div className="mt-20">
      <div className="flex flex-wrap gap-8 md:gap-16 border-b border-[#16697A]/10 pb-4 mb-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`relative py-2 text-lg font-[700] transition-all font-sans uppercase tracking-[0.1em] ${active === tab.id ? "text-[#16697A]" : "text-[#6B7280]/60 hover:text-[#16697A]"
              }`}
          >
            {tab.label}
            {active === tab.id && (
              <div className="absolute -bottom-4 left-0 w-full h-1 bg-[#FFA62B] rounded-full animate-in slide-in-from-left duration-300" />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {active === 1 && (
          <div className="bg-white/40 backdrop-blur-md rounded-[48px] p-10 md:p-16 border border-white shadow-soft animate-in fade-in duration-700">
            <p className="text-[#6B7280] text-lg leading-relaxed whitespace-pre-line font-[500] font-sans">
              {data.description}
            </p>
          </div>
        )}

        {active === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-700">
            {data && data.reviews && data.reviews.length > 0 ? (
              data.reviews.map((item, index) => (
                <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border border-white shadow-soft transition-all hover:scale-[1.02]" key={index}>
                  <div className="flex items-center gap-4 mb-6">
                    <img src={getImageUrl(item.user.avatar)} alt="" className="w-14 h-14 rounded-2xl object-cover shadow-md" />
                    <div>
                      <h4 className="font-[700] text-[#16697A] font-sans">{item.user?.name}</h4>
                      <Ratings rating={item?.rating} />
                    </div>
                  </div>
                  <p className="text-[#6B7280] font-[500] leading-relaxed italic font-sans">"{item.comment}"</p>
                  <p className="text-[10px] font-[700] text-[#9CA3AF] uppercase tracking-widest mt-6 font-sans">Verified Purchase • 2 days ago</p>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <h4 className="text-xl font-[600] text-[#16697A] font-sans">No Reviews for this product!</h4>
              </div>
            )}
          </div>
        )}

        {active === 3 && (
          <div className="flex flex-col lg:flex-row gap-12 animate-in fade-in duration-700">
            <div className="w-full lg:w-[40%] bg-[#16697A] rounded-[48px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
              <div className="relative z-10">
                <img src={getImageUrl(data?.shop?.avatar)} alt="" className="w-32 h-32 rounded-[32px] object-cover mb-8 border-4 border-white/20 shadow-2xl" />
                <h2 className="text-4xl font-black mb-2">{data.shop.name}</h2>
                <p className="text-[#82C0CC] font-bold mb-8">Official Partner Store</p>
                <div className="grid grid-cols-2 gap-6 mt-12">
                  <div>
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Joined</p>
                    <p className="font-black">{data.shop?.createdAt?.slice(0, 4)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Products</p>
                    <p className="font-black">{products?.length || 0}+</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Satisfaction</p>
                    <p className="font-black">98.5%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Rating</p>
                    <p className="font-black text-[#FFA62B]">{averageRating.toFixed(1)}/5</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white/40 backdrop-blur-md rounded-[48px] p-10 md:p-16 border border-white shadow-soft flex flex-col justify-center">
              <h3 className="text-2xl font-[700] text-[#16697A] mb-6 font-display italic">Shop Info</h3>
              <p className="text-[#6B7280] text-lg leading-relaxed font-[500] mb-12 font-sans">
                {data?.shop?.description}
              </p>
              <Link to={`/shop/preview/${data?.shop._id}`} className="inline-flex items-center justify-center h-20 px-12 bg-[#16697A] text-[#EDE7E3] font-[700] rounded-3xl hover:bg-[#FFA62B] transition-all duration-500 shadow-xl self-start font-sans uppercase tracking-widest text-sm">
                Visit Shop
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;