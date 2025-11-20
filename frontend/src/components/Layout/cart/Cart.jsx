import React, { useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from '../../../styles/styles';
import { Link } from "react-router-dom";

const Cart = ({ setOpenCart }) => {
  const cartData = [
    { name: "Iphone 14 pro max 256gb ssd and 8gb ram silver colour", description: "test", price: 999 },
    { name: "Iphone 14 pro max 256gb ssd and 8gb ram silver colour", description: "test", price: 245 },
    { name: "Iphone 14 pro max 256gb ssd and 8gb ram silver colour", description: "test", price: 456 },
  ];

  // total price calculation
  const totalPrice = cartData.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className='fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10'>
      <div className="fixed top-0 right-0 min-h-full w-[25%] bg-white flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex w-full justify-end pt-5 pr-5">
            <RxCross1 size={25} className="cursor-pointer" onClick={() => setOpenCart(false)} />
          </div>

          {/* Item length */}
          <div className={`${styles.noramlFlex} p-4`}>
            <IoBagHandleOutline size={25} />
            <h5 className='pl-2 text-[20px] font-[500]'>
              {cartData.length} items
            </h5>
          </div>

          {/* Cart single items */}
          <div className='w-full border-t'>
            {cartData.map((i, index) => <CartSingle key={index} data={i} />)}
          </div>
        </div>

        {/* Checkout Button */}
        <div className="px-5 mb-3">
          <Link to="/checkout">
            <div className="h-[45px] flex items-center justify-center w-full bg-[#e44343] rounded-[5px] cursor-pointer">
              <h1 className='text-white text-[18px] font-[500]'>
                Checkout now (USD ${totalPrice})
              </h1>
            </div>
          </Link>
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
        {/* Quantity Controls */}
        <div className="flex flex-col items-center">
          <div className="bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={() => setValue(value + 1)}>
            <HiPlus size={12} color="#fff" />
          </div>
          <span className="py-1">{value}</span>
          <div className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={() => setValue(value === 1 ? 1 : value - 1)}>
            <HiOutlineMinus size={14} color="#7d879c" />
          </div>
        </div>

        {/* Product Image */}
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/015/724/893/small/3d-rendering-of-isolated-winter-jacket-icon-free-png.png"
          alt=""
          className='w-[80px] h-[80px] object-cover'
        />

        {/* Product Info */}
        <div className='pl-2'>
          <h1 className='font-[500]'>{data.name}</h1>
          <h4 className='text-[15px] text-[#00000082]'>${data.price} × {value}</h4>
          <h4 className='font-[600] text-[17px] text-[#d02222] pt-[3px] font-Roboto'>US${totalPrice}</h4>
        </div>

        {/* Remove Item */}
        <RxCross1 className='cursor-pointer ml-auto' />
      </div>
    </div>
  )
}

export default Cart
