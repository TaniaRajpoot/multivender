import React, { useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import {BsCartPlus} from "react-icons/bs"
import { AiOutlineHeart } from "react-icons/ai";


import { Link } from "react-router-dom";
import styles from '../../styles/styles';

const Wishlist = ({ setOpenWishList }) => {
  const cartData = [
    { name: "Iphone 14 pro max 256gb ssd and 8gb ram silver colour", description: "test", price: 999 },
    { name: "Iphone 14 pro max 256gb ssd and 8gb ram silver colour", description: "test", price: 245 },
    { name: "Iphone 14 pro max 256gb ssd and 8gb ram silver colour", description: "test", price: 456 },
  ];

  return (
    <div className='fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10'>
      <div className="fixed top-0 right-0 min-h-full w-[25%] bg-white flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex w-full justify-end pt-5 pr-5">
            <RxCross1 size={25} className="cursor-pointer" onClick={() => setOpenWishList(false)} />
          </div>

          {/* Item length */}
          <div className={`${styles.noramlFlex} p-4`}>
            <AiOutlineHeart size={25} />
            <h5 className='pl-2 text-[20px] font-[500]'>
              {cartData.length} items
            </h5>
          </div>

          {/* Cart single items */}
          <div className='w-full border-t'>
            {cartData.map((i, index) => <CartSingle key={index} data={i} />)}
          </div>
        </div>

        
      </div>
    </div>
  )
}

const CartSingle = ({ data }) => {
  const [value, setValue] = useState(1);
  const totalPrice = data.price * value;

  return (
    <div className='border-b p-4'>
      <div className="w-full flex items-center gap-3">
        <RxCross1 className='cursor-pointer'/>
         <img
          src="https://static.vecteezy.com/system/resources/thumbnails/015/724/893/small/3d-rendering-of-isolated-winter-jacket-icon-free-png.png"
          alt=""
          className='w-[80px] h-[80px] object-cover'
        />

      

        {/* Product Image */}
       

        {/* Product Info */}
        <div className='pl-2'>
          <h1 className='font-[500]'>{data.name}</h1>
          <h4 className='text-[15px] text-[#00000082]'>${data.price} × {value}</h4>
          <h4 className='font-[600] text-[17px] text-[#d02222] pt-[3px] font-Roboto'>US${totalPrice}</h4>
        </div>
        <div>
          <BsCartPlus size={20} className="cursor-pointer" title ="Add to cart "/>
        </div>

       
      </div>
    </div>
  )
}

export default Wishlist
