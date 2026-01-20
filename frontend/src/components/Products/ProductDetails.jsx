import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { backend_url, server } from "../../server";
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
  const shopIdRef = React.useRef(null);

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
useEffect(() => {
    dispatch(getAllProductsShop(data && data?.shop._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [dispatch, wishlist, data]);


  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

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

  const totalReviewsLength =
    products?.length > 0
      ? products.reduce(
          (acc, product) => acc + (product?.reviews?.length || 0),
          0
        )
      : 0;

  const totalRatings =
    products?.length > 0
      ? products.reduce(
          (acc, product) =>
            acc +
            (product.reviews?.length > 0
              ? product.reviews.reduce(
                  (sum, review) => sum + (review.rating || 0),
                  0
                )
              : 0),
          0
        )
      : 0;

  const averageRating = totalReviewsLength > 0 ? totalRatings / totalReviewsLength : 0;

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      axios
        .post(`${server}/conversation/create-new-converation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?/${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data?.message);
        });
    } else {
      toast.error("Please Login To Create A Conversation!");
    }
  };

  return (
    <div className="bg-white">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              {/* Left Part - Images */}
              <div className="w-full 800px:w-[50%]">
                <img
                  src={getImageUrl(data.images?.[select])}
                  alt={data.name}
                  className="w-[80%] object-contain"
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />
                <div className="w-full flex gap-2 mt-3">
                  {data &&
                    data.images.map((i, index) => (
                      <div
                        key={index}
                        className={`${
                          select === index ? "border-2 border-blue-500" : "border"
                        } cursor-pointer rounded overflow-hidden`}
                      >
                        <img
                          src={getImageUrl(i)}
                          alt=""
                          className="h-[100px] w-[100px] object-cover"
                          onClick={() => setSelect(index)}
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                          }}
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* Right Part - Product Info */}
              <div className="w-full 800px:w-[50%] pt-5 800px:pl-8">
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <p className="mt-4 text-gray-600">{data.description}</p>
                
                <div className="flex items-center gap-3 pt-4">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    ${data.discountPrice}
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.originalPrice ? `$${data.originalPrice}` : null}
                  </h3>
                </div>

                {/* Quantity Handler */}
                <div className="flex items-center mt-8 justify-between pr-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-md px-4 py-2 shadow-lg hover:opacity-95 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 px-6 py-2 font-medium rounded-md">
                      {count}
                    </span>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-md px-4 py-2 shadow-lg hover:opacity-95 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => removeFromWishlistHandler(data)}
                        color="red"
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addToWishlistHandler(data)}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div
                  className={`${styles.button} !rounded !mt-6 capitalize text-white font-semibold !h-11 flex items-center justify-center cursor-pointer`}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <span className="text-white flex items-center gap-2">
                    Add to Cart
                    <AiOutlineShoppingCart size={20} />
                  </span>
                </div>

                {/* Seller Part */}
                <div className="flex items-center pt-8">
                  <Link to={`/shop/preview/${data.shop?._id}`} className="flex items-center">
                    <img
                      className="w-[50px] h-[50px] rounded-full mr-4"
                      src={getImageUrl(data?.shop?.avatar)}
                      alt={data?.shop?.name}
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                    <div>
                      <h3 className={`${styles.shop_name}`}>
                        {data?.shop?.name}
                      </h3>
                      <h5 className="text-[15px] text-gray-600">
                        ({averageRating.toFixed(1)}/5) Ratings
                      </h5>
                    </div>
                  </Link>

                  <div
                    className={`${styles.button} bg-[#6443d1] ml-auto !rounded !h-11 capitalize cursor-pointer`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-white flex items-center gap-2">
                      Send Message <AiOutlineMessage />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details and More Information */}
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

const ProductsDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
  getImageUrl,
}) => {
  const [active, setActive] = useState(1);

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 && <div className={`${styles.active_indicator}`}></div>}
        </div>
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 && <div className={`${styles.active_indicator}`}></div>}
        </div>
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 && <div className={`${styles.active_indicator}`}></div>}
        </div>
      </div>

      {active === 1 && (
        <div className="py-4">
          <p className="text-[16px] leading-7 whitespace-pre-line">
            {data.description}
          </p>
        </div>
      )}

      {active === 2 && (
        <div className="w-full min-h-[40vh] flex flex-col py-3 overflow-y-scroll">
          {data && data.reviews && data.reviews.length > 0 ? (
            data.reviews.map((item, index) => (
              <div className="w-full flex my-4" key={index}>
                <img
                  src={getImageUrl(item.user.avatar)}
                  alt={item.user.name}
                  className="w-[50px] h-[50px] rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />
                <div className="pl-4">
                  <div className="w-full flex items-center">
                    <h1 className="font-[600] mr-3">{item.user?.name}</h1>
                    <Ratings rating={item?.rating} />
                  </div>
                  <p className="mt-2 text-gray-700">{item.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">No reviews available</p>
          )}
        </div>
      )}

      {active === 3 && (
        <div className="w-full block 800px:flex justify-between p-5">
          {/* Left Section */}
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/preview/${data?.shop?._id}`}>
              <div className="flex items-center">
                <img
                  src={getImageUrl(data?.shop?.avatar)}
                  alt={data?.shop?.name}
                  className="w-[50px] h-[50px] rounded-full mr-4 object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />
                <div>
                  <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                  <h5 className="text-[15px] text-gray-600">
                    ({averageRating.toFixed(1)}/5) Ratings
                  </h5>
                </div>
              </div>
            </Link>
            <p className="pt-4 text-gray-600">{data?.shop?.description}</p>
          </div>

          {/* Right Section */}
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined On:{" "}
                <span className="font-[500]">
                  {data.shop?.createdAt?.slice(0, 10)}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Products:{" "}
                <span className="font-[500]">
                  {products && products.length}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Reviews:{" "}
                <span className="font-[500]">{totalReviewsLength}</span>
              </h5>
              <Link to={`/shop/preview/${data?.shop._id}`}>
                <div
                  className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}
                >
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;