import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../../styles/styles";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineShoppingCart } from "react-icons/ai";

const ProductDetailsCard = ({ setOpen, data }) => {
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  // const [select, setSelect] = useState(false);

  const handleMessageSubmit = () => {};

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  return (
    <div>
      {data ? (
        <div className="fixed inset-0 bg-[#00000030] bg-opacity-30 z-40 flex items-center justify-center">
          <div className="w-[90%] md:w-[800px] max-h-[75vh] overflow-y-auto bg-white rounded-md shadow-sm relative p-6">
            {/* Close Button */}
            <RxCross1
              size={30}
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setOpen(false)}
            />

            {/* Product Content */}
            <div className="block w-full md:flex">
              <div className="w-full md:w-[50%]">
                <img src={data.image_Url[0].url} alt="" />

                <div className="flex">
                  <img
                    src={data.shop.shop_avatar.url}
                    className="w-[50px] h-[50px] rounded-full mr-2"
                    alt=""
                  />

                  <div>
                    <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                    <h5 className="pb-3 text-[15px]">
                      ({data.shop.ratings}) Ratings
                    </h5>
                  </div>
                </div>
                {/* Button */}
                <div
                  className={`${styles.button} bg-[#000] mt-4 rounded-[4px] h-11`}
                  onClick={handleMessageSubmit}
                >
                  <span className="text-[#fff] flex items-center">
                    Send Message <AiOutlineMessage className="ml-5" />
                  </span>
                </div>
                {/* SoldOut */}
                <h5 className="text-[16px] text-[red] mt-5">
                  ({data.total_sell}) SoldOut
                </h5>
              </div>

              <div className="w-full md:w-[50%] pt-5 pl-[5px] pr-[5px] ">
                <h1 className={`${styles.productTitle} text-[20px]`}>
                  {data.name}
                </h1>
                <p>{data.description}</p>
                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data.discount_price}$
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.price ? data.price + "$" : null}
                  </h3>
                </div>
                <div className="flex items-center mt-12 justify-between pr-3">
                  <div>
                    <button
                      onClick={decrementCount}
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bolf rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                      {" "}
                      {count}
                    </span>
                    <button
                      onClick={incrementCount}
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bolf rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer "
                        onClick={() => setClick(!click)}
                        color={click ? "red" : "#333"}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={22}
                        className="cursor-pointer  "
                        onClick={() => setClick(!click)}
                        color={click ? "red" : "#333"}
                        title="Add to  wishlist"
                      />
                    )}
                  </div>
                </div>

                <div className={`${styles.button}mt-6 rounded-[4px] h-11 flex items-center`}>
                  <span className="text-[#fff] flex items-center">
                  Add to cart <AiOutlineShoppingCart className="ml-1 />" />
                  </span>
                </div>


              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;
