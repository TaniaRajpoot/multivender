import React, { useState, useEffect } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import styles from "../../../styles/styles";
import ProductCardDetails from "../ProductDetailsCard/ProductDetailsCard";
import { removeFromWishList ,addToWishList} from "../../../redux/actions/wishlist";

const ProductCard = ({ data, isEvent }) => {
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(1);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);  

  useEffect(() => {
    if (wishlist && wishlist.find((item) => item._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

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

  const removeFromWishListHandler = (data) => {
    setClick(false);
    dispatch(removeFromWishList(data));
  }

  const addtoWishListHandler = (data) => {  
    setClick(true);
    dispatch(addToWishList(data));
    // Dispatch add to wishlist action here if needed
  }


    const addToCartHandler = (id) => {
      const isItemExist = cart.find((i) => i._id === data._id);
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
    <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
        <div className="flex justify-end"></div>
        <Link
          to={`${
            isEvent === true
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }`}
        >
          <img
            src={getImageUrl(data.images?.[0])}
            alt={data.name}
            className="w-full h-[170px] object-cover rounded-t-lg"
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
        </Link>
        
        {/* Shop name - make it safely accessible */}
        {data?.shop && (
          <Link to={`/shop/preview/${data.shop._id}`}>
            <h5 className={`${styles.shop_name}`}>{data.shop.name}</h5>
          </Link>
        )}
        
        <Link
          to={`${
            isEvent === true
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }`}
        >
          <h4 className="pb-3 font-medium">
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>

          <div className="py-2 flex items-center justify-between">
            <div className="flex">
              <h5 className={`${styles.productDiscountPrice}`}>
                {data.discountPrice}$
              </h5>
              {data.originalPrice && data.originalPrice !== data.discountPrice && (
                <h4 className={`${styles.price}`}>
                  {data.originalPrice}$
                </h4>
              )}
            </div>
            <span className="font-normal text-[17px] text-[#68d284]">
              {data?.soldOut !== undefined ? `(${data.soldOut} sold)` : "(0 sold)"}
            </span>
          </div>
        </Link>

        {/* side options */}
        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => removeFromWishListHandler(data) }
              color="red"
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => addtoWishListHandler(data)}
              color="#333"
              title="Add to wishlist"
            />
          )}
          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)}
            color="#333"
            title="Quick view"
          />
          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-2 top-24"
            onClick={() => addToCartHandler(data._id)}
            color="#444"
            title="Add to cart"
          />
          {open ? <ProductCardDetails setOpen={setOpen} data={data} /> : null}
        </div>
      </div>
    </>
  );
};

export default ProductCard;