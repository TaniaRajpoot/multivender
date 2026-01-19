// import React, { useEffect, useState } from "react";
// import styles from "../../styles/styles";
// import CountDown from "./CountDown";
// import { backend_url } from "../../server";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// // import { addToCart } from "../../redux/actions/cart";
// import { Link } from "react-router-dom";
// const EventCard = ({ active, data }) => {
//   const dispatch = useDispatch();
// //   const { cart } = useSelector((state) => state.cart);
// //   const addToCartHandler = (product) => {
// //     const isItemExists = cart && cart.find((i) => i._id === product._id);
// //     if (isItemExists) {
// //       toast.error("Item is already in the cart!");
// //     } else {
// //       if (product.stock < 1) {
// //         toast.error("Product stock limited!");
// //       } else {
// //         const cartData = { ...product, qty: 1 };
// //         dispatch(addToCart(cartData));
// //         toast.success("Item added to cart successfully!");
// //       }
// //     }
// //   };
//   return (
//     <div
//       className={`w-full block bg-white ${active ? "unset" : "mb-12"} rounded-lg
//      lg:flex p-2 `}
//     >
//       <div className="w-full lg:w-[50%] m-auto ">
//         <img src={`${data.images[0]?.url}`} alt="" />
//       </div>
//       <div className="w-full lg:w-[50%] flex flex-col justify-center">
//         <h2 className={`${styles.productTitle} `}>{data?.name}</h2>
//         <p>{data?.description}</p>
//         <div className="flex py-2 justify-between">
//           <div className="flex">
//             <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
//               {/* {data.originalPrice}$ */}
//             </h5>
//             <h5 className="font-bold text-[20px] text-[#333] font-Roboto ">
//               {/* {data.discountPrice}$ */}
//             </h5>
//           </div>
//           <span className="pr-3 font-[400] text-[17px] text-[#44a55e] ">
//             120 Sold
//           </span>
//         </div>
//         {/* <CountDown data={data} /> */}
//         <br />
//         <div className="flex items-center ">
//           {/* <Link to={`/product/${data._id}?isEvent=true`}>
//             <div className={`${styles.button} text-[#fff]`}>See Details</div>
//           </Link> */}
//           <div
//             className={`${styles.button} text-[#fff] ml-5`}
//             // onClick={() => {
//             //   addToCartHandler(data);
//             // }}
//           >
//             Add to Cart
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventCard;

import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import CountDown from "./CountDown";
import { backend_url } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// import { addToCart } from "../../redux/actions/cart";
import { Link } from "react-router-dom";

const EventCard = ({ active, data }) => {
  const dispatch = useDispatch();
  
  // Safety check
  if (!data) {
    return null;
  }

  return (
    <div
      className={`w-full block bg-white ${active ? "unset" : "mb-12"} rounded-lg lg:flex p-2`}
    >
      <div className="w-full lg:w-[50%] m-auto">
        <img 
          src={data.image_Url?.[0]?.url || data.images?.[0]?.url} 
          alt={data.name}
          className="w-full h-auto object-contain"
        />
      </div>
      <div className="w-full lg:w-[50%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}>{data?.name}</h2>
        <p>{data?.description}</p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-medium text-[18px] text-[#d55b45] pr-3 line-through">
              {data.price}$
            </h5>
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
              {data.discount_price}$
            </h5>
          </div>
          <span className="pr-3 font-normal text-[17px] text-[#44a55e]">
            {data.total_sell} Sold
          </span>
        </div>
        <CountDown data={data} />
        <br />
        <div className="flex items-center">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <div className={`${styles.button} text-white`}>See Details</div>
          </Link>
          <div
            className={`${styles.button} text-white ml-5`}
            // onClick={() => {
            //   addToCartHandler(data);
            // }}
          >
            Add to Cart
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;