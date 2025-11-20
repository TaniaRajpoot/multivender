// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineShoppingCart } from 'react-icons/ai';
// import styles from '../../styles/styles';

// const ProductDetails = ({ data }) => {
//   const [count, setCount] = useState(1);
//   const [click, setClick] = useState(false);
//   const [select, setSelect] = useState(0);
//   const navigate = useNavigate();

//   const incrementCount = () => setCount(count + 1);
//   const decrementCount = () => {
//     if (count > 1) setCount(count - 1);
//   };

//   const handleMessageSubmit = () => {
//     navigate("/inbox?conversation=507ebjver884ehfdjeriv84");
//   };

//   return (
//     <div className="bg-white">
//       {data ? (
//         <div className={`${styles.section} w-[90%] md:w-[80%] mx-auto`}>
//           <div className="w-full py-5">
            
//             {/* MAIN FLEX CONTAINER */}
//             <div className="w-full flex flex-col md:flex-row items-start gap-8">
              
//               {/* LEFT SIDE - IMAGES */}
//               <div className="w-full md:w-1/2">
//                 <img
//                   src={data.image_Url[select].url}
//                   alt={data.name}
//                   className="w-full max-h-[500px] object-contain rounded-md"
//                 />

//                 <div className="w-full flex gap-2 mt-3">
//                   {data.image_Url.map((img, i) => (
//                     <div
//                       key={i}
//                       className={`${
//                         select === i ? 'border border-black' : ''
//                       } cursor-pointer p-1`}
//                       onClick={() => setSelect(i)}
//                     >
//                       <img
//                         src={img.url}
//                         alt=""
//                         className="h-[120px] w-[120px] object-contain rounded-md"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* RIGHT SIDE - DETAILS */}
//               <div className="w-full md:w-1/2 pt-5">
//                 <h1 className={`${styles.productTitle} text-[22px] md:text-[26px]`}>
//                   {data.name}
//                 </h1>
//                 <p className="text-gray-700 leading-6">{data.description}</p>

//                 {/* PRICE SECTION */}
//                 <div className="flex pt-3 items-center gap-3">
//                   <h4 className={`${styles.productDiscountPrice} text-[22px]`}>
//                     {data.discount_price}$
//                   </h4>
//                   {data.price && (
//                     <h3 className={`${styles.price} line-through text-gray-500`}>
//                       {data.price}$
//                     </h3>
//                   )}
//                 </div>

//                 {/* QUANTITY & WISHLIST */}
//                 <div className="flex items-center mt-10 justify-between pr-3">
//                   <div>
//                     <button
//                       onClick={decrementCount}
//                       className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow hover:opacity-75 transition"
//                     >
//                       -
//                     </button>
//                     <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
//                       {count}
//                     </span>
//                     <button
//                       onClick={incrementCount}
//                       className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-r px-4 py-2 shadow hover:opacity-75 transition"
//                     >
//                       +
//                     </button>
//                   </div>

//                   <div>
//                     {click ? (
//                       <AiFillHeart
//                         size={30}
//                         className="cursor-pointer"
//                         onClick={() => setClick(!click)}
//                         color="red"
//                         title="Remove from wishlist"
//                       />
//                     ) : (
//                       <AiOutlineHeart
//                         size={30}
//                         className="cursor-pointer"
//                         onClick={() => setClick(!click)}
//                         color="#333"
//                         title="Add to wishlist"
//                       />
//                     )}
//                   </div>
//                 </div>

//                 {/* ADD TO CART BUTTON */}
//                 <div
//                   className={`${styles.button} !mt-6 !rounded !h-11 flex items-center justify-center cursor-pointer`}
//                 >
//                   <span className="text-white flex items-center gap-2">
//                     Add to Cart <AiOutlineShoppingCart />
//                   </span>
//                 </div>

//                 {/* SHOP INFO */}
//                 <div className="flex items-center pt-8">
//                   <img
//                     src={data.shop.shop_avatar.url}
//                     className="w-[50px] h-[50px] rounded-full mr-2"
//                     alt={data.shop.name}
//                   />
//                   <div>
//                     <h3 className={`${styles.shop_name} pb-1`}>
//                       {data.shop.name}
//                     </h3>
//                     <h5 className="text-[15px] text-gray-500">
//                       ({data.shop.ratings}) Ratings
//                     </h5>
//                   </div>
              

//                 {/* MESSAGE BUTTON */}
//                 <div
//                   className={`${styles.button} !bg-[#6443d1] mt-6 !rounded !h-11 flex   items-center justify-center cursor-pointer`}
//                   onClick={handleMessageSubmit}
//                 >
//                   <span className="text-white flex items-center ">
//                     Send Message <AiOutlineMessage />
//                   </span>
//                 </div>
//                   </div>
//               </div>
//             </div>
//           </div>
//            <ProductDetailsInfo data={data} />
//         <br />
//         <br />
//         </div>
//       ) : null}
//     </div>
//   );
// };




// const ProductDetailsInfo = () =>{
//   const [active, setActive] = useState(1);

//   return (
//     <div className='bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded h-[40vh] '>
//       <div className="w-full justify-between border-b pt-10 pb-2">
//         <div className='relative'>
//           <h5 className={"text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"} onClick={()=>setActive(1) }>Product Details</h5>
//         {
//           active === 1 ? (
//             <div className={`${styles.active_indicator}`}/>
//           ) : null
//         }
//         </div>
//         <div className='relative'>
//           <h5 className={"text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"} onClick={()=>setActive(2) }>Product Review</h5>
//         {
//           active === 2 ? (
//             <div className={`${styles.active_indicator}`}/>
//           ) : null
//         }
//         </div>
//         <div className='relative'>
//           <h5 className={"text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"} onClick={()=>setActive(3) }>Seller information</h5>
//         {
//           active === 3 ? (
//             <div className={`${styles.active_indicator}`}/>
//           ) : null
//         }
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductDetails;




import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from 'react-icons/ai';
import styles from '../../styles/styles';

const ProductDetails = ({ data }) => {
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();

  const incrementCount = () => setCount(count + 1);
  const decrementCount = () => {
    if (count > 1) setCount(count - 1);
  };

  const handleMessageSubmit = () => {
    navigate('/inbox?conversation=507ebjver884ehfdjeriv84');
  };

  return (
    <div className="bg-white w-full py-10">
      {data ? (
        <div className={`${styles.section} w-[90%] md:w-[80%] mx-auto`}>
          {/* MAIN FLEX CONTAINER */}
          <div className="flex flex-col md:flex-row items-start gap-10">
            {/* LEFT SIDE - IMAGES */}
            <div className="w-full md:w-1/2">
              <img
                src={data.image_Url[select].url}
                alt={data.name}
                className="w-full max-h-[450px] object-contain rounded-md shadow-sm"
              />
              <div className="flex gap-3 mt-4 justify-center md:justify-start">
                {data.image_Url.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setSelect(i)}
                    className={`cursor-pointer border-2 rounded-md p-1 transition ${
                      select === i ? 'border-[#6443d1]' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="h-[100px] w-[100px] object-contain rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE - DETAILS */}
            <div className="w-full md:w-1/2">
              <h1 className="text-[26px] font-semibold text-gray-800 mb-2">
                {data.name}
              </h1>
              <p className="text-gray-700 leading-6">{data.description}</p>

              {/* PRICE SECTION */}
              <div className="flex items-center gap-3 pt-3">
                <h4 className="text-[24px] font-bold text-[#333]">
                  {data.discount_price}$
                </h4>
                {data.price && (
                  <h3 className="line-through text-gray-500 text-[18px]">
                    {data.price}$
                  </h3>
                )}
              </div>

              {/* QUANTITY & WISHLIST */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center">
                  <button
                    onClick={decrementCount}
                    className="bg-[#38b2ac] text-white font-bold px-4 py-2 rounded-l shadow hover:opacity-80"
                  >
                    -
                  </button>
                  <span className="bg-gray-100 text-gray-800 font-medium px-5 py-[11px]">
                    {count}
                  </span>
                  <button
                    onClick={incrementCount}
                    className="bg-[#38b2ac] text-white font-bold px-4 py-2 rounded-r shadow hover:opacity-80"
                  >
                    +
                  </button>
                </div>

                {/* HEART ICON */}
                <div>
                  {click ? (
                    <AiFillHeart
                      size={30}
                      onClick={() => setClick(!click)}
                      className="cursor-pointer"
                      color="red"
                      title="Remove from wishlist"
                    />
                  ) : (
                    <AiOutlineHeart
                      size={30}
                      onClick={() => setClick(!click)}
                      className="cursor-pointer"
                      color="#333"
                      title="Add to wishlist"
                    />
                  )}
                </div>
              </div>

              {/* ADD TO CART BUTTON */}
              <button
                className="mt-6 w-full bg-black text-white py-3 rounded-md font-medium flex items-center justify-center gap-2 hover:opacity-80 transition"
              >
                Add to Cart <AiOutlineShoppingCart size={20} />
              </button>

              {/* SHOP INFO */}
              <div className="flex items-center justify-between mt-8">
                <div className="flex items-center gap-3">
                  <img
                    src={data.shop.shop_avatar.url}
                    alt={data.shop.name}
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-[17px] font-semibold text-gray-800">
                      {data.shop.name}
                    </h3>
                    <h5 className="text-[14px] text-gray-500">
                      ({data.shop.ratings}) Ratings
                    </h5>
                  </div>
                </div>

                {/* MESSAGE BUTTON */}
                <button
                  onClick={handleMessageSubmit}
                  className="bg-[#6443d1] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:opacity-85 transition"
                >
                  Send Message <AiOutlineMessage size={20} />
                </button>
              </div>
            </div>
          </div>
        <ProductDetailsInfo data={data} />
        <br />
        <br />
        </div>
        
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({data}) =>{
  const [active, setActive] = useState(1);

  return (
    <div className='bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded  '>
      <div className="w-full  flex justify-between border-b border-gray-200 pt-10 pb-2">
        <div className='relative'>
          <h5 className={"text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"} onClick={()=>setActive(1) }>Product Details</h5>
        {
          active === 1 ? (
            <div className={`${styles.active_indicator}`}/>
          ) : null
        }
        </div>
        <div className='relative'>
          <h5 className={"text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"} onClick={()=>setActive(2) }>Product Review</h5>
        {
          active === 2 ? (
            <div className={`${styles.active_indicator}`}/>
          ) : null
        }
        </div>
        <div className='relative'>
          <h5 className={"text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"} onClick={()=>setActive(3) }>Seller information</h5>
        {
          active === 3 ? (
            <div className={`${styles.active_indicator}`}/>
          ) : null
        }
        </div>
      </div>
      {
        active === 1 ?(
          <>
          <p className=' py-2 text-[18px leading-8 pb-10  whitespace-pre-line '>
            This product combines powerful performance with sleek design, making it perfect for both professional and everyday use. Built with premium materials, it offers exceptional durability and style. Featuring a high-resolution display for vibrant visuals, fast processing speed for seamless multitasking, and long battery life to keep you productive throughout the day. Whether you're working, studying, or streaming, this product delivers outstanding efficiency and comfort. Designed to meet modern lifestyle needs, it ensures smooth performance, reliable connectivity, and a superior user experience.
          </p>
          <p className=' py-2 text-[18px leading-8 pb-10  whitespace-pre-line '>
            This product combines powerful performance with sleek design, making it perfect for both professional and everyday use. Built with premium materials, it offers exceptional durability and style. Featuring a high-resolution display for vibrant visuals, fast processing speed for seamless multitasking, and long battery life to keep you productive throughout the day. Whether you're working, studying, or streaming, this product delivers outstanding efficiency and comfort. Designed to meet modern lifestyle needs, it ensures smooth performance, reliable connectivity, and a superior user experience.
          </p>
          <p className=' py-2 text-[18px leading-8 pb-10  whitespace-pre-line '>
            This product combines powerful performance with sleek design, making it perfect for both professional and everyday use. Built with premium materials, it offers exceptional durability and style. Featuring a high-resolution display for vibrant visuals, fast processing speed for seamless multitasking, and long battery life to keep you productive throughout the day. Whether you're working, studying, or streaming, this product delivers outstanding efficiency and comfort. Designed to meet modern lifestyle needs, it ensures smooth performance, reliable connectivity, and a superior user experience.
          </p>
          </>
        ) : null 
      }

      {
        active === 2 ? (
          <div className='w-full justify-center min-h-[40vh] flex items-center'> 
            <p>No Reviews yet!</p>
          </div>
        ): null
      }

      {
        active === 3 ?(
          <div className='w-full block 800px:flex p-5'>
            <div className="w-full 800px:2-[50%]">
              <div className='flex items-center'>
                <img src={data.shop.shop_avatar.url} className='w-[50px] h-[50px] rounded-full' alt="" />
                <div>
                    <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                    <h5 className="pb-3 text-[15px]">
                      ({data.shop.ratings}) Ratings
                    </h5>
               
                  </div>
              </div>
                   <p className="pt-2">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero, consequatur laborum impedit minima explicabo eum eaque repudiandae facere possimus molestiae, laudantium cupiditate, officia aut corporis? Excepturi et veniam temporibus aliquam?
                    </p>
            </div> 
            <div className='w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end'>
              <div className='text-left'>
                <h5 className='font-[600]'>
                  Joined on: <span className='font-[500]'> 14 March,2025</span>
                </h5>
                <h5 className='font-[600]'>
                  Total Products: <span className='font-[500]'> 1,223</span>
                </h5>
                <h5 className='font-[600]'>
                  Total Reviews: <span className='font-[500]'> 324</span>
                </h5>
                <Link to = "/" >
                <div className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}>
                  <h4 className='text-white'>
                    Visit Shop
                  </h4>

                </div>
                </Link>
              </div>
            </div>

          </div>

        ) : null
      }
    </div>
  )
}




export default ProductDetails;

