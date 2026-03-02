import React from "react";
import CountDown from "./CountDown";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/actions/cart";
import { Link } from "react-router-dom";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

const EventCard = ({ active, data }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  const addToCartHandler = (product) => {
    const isItemExists = cart && cart.find((i) => i._id === product._id);
    if (isItemExists) {
      toast.error("Item is already in the cart!");
    } else {
      if (product.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...product, qty: 1 };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <div className={`w-full bg-white border border-[#16697A]/10 rounded-[40px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 flex flex-col lg:flex-row gap-6 p-4 md:p-5 mb-8 group min-h-[350px]`}>

      {/* Visual Identity Section */}
      <div className="w-full lg:w-[32%] relative group">
        <div className="w-full h-full min-h-[220px] rounded-[32px] overflow-hidden bg-[#EDE7E3]/50 border-2 border-white shadow-inner relative">
          <img
            src={`${data.images[0]?.url}`}
            alt={data?.name}
            className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 px-3 py-1 bg-[#16697A] text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg font-sans">
            Event
          </div>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="w-full lg:w-[68%] flex flex-col justify-between py-2">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#16697A] rounded-full animate-pulse" />
            <p className="text-[10px] font-bold text-[#16697A] uppercase tracking-widest font-sans">Flash Deal Active</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#0D3D47] tracking-tight leading-tight group-hover:text-[#16697A] transition-colors duration-500">
            {data?.name}
          </h2>
          <p className="text-sm font-medium text-[#6B7280] leading-relaxed line-clamp-2 max-w-[500px]">
            {data?.description}
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 mt-auto border-t border-[#16697A]/5">
          {/* Pricing & Deadline */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-6">
              <div className="space-y-0.5">
                <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest font-sans">Special Offer</p>
                <div className="flex items-center gap-3">
                  <h5 className="text-3xl font-black text-[#16697A] tracking-tighter">${data.discountPrice}</h5>
                  <h5 className="text-lg font-bold text-[#6B7280]/40 line-through">${data.originalPrice}</h5>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-[#16697A]/10" />
              <div className="px-4 py-1.5 bg-[#EDE7E3] text-[#16697A] text-[10px] font-black uppercase tracking-widest rounded-xl">
                {data?.sold_out || 0} Sold
              </div>
            </div>

            {/* Compact Countdown */}
            <div className="inline-flex items-center gap-4 bg-[#0D3D47] px-6 py-3 rounded-2xl shadow-xl">
              <p className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Ends In</p>
              <div className="h-4 w-[1px] bg-white/10" />
              <CountDown data={data} />
            </div>
          </div>

          {/* Tactical Actions */}
          <div className="flex items-center gap-3">
            <Link to={`/product/${data._id}?isEvent=true`}>
              <button className="h-14 px-8 border-2 border-[#16697A] text-[#16697A] font-black rounded-2xl hover:bg-[#16697A] hover:text-white transition-all transform hover:scale-[1.05] uppercase tracking-widest text-[10px] font-sans">
                Details
              </button>
            </Link>
            <button
              onClick={() => addToCartHandler(data)}
              className="h-14 px-8 bg-[#FFA62B] text-white font-black rounded-2xl hover:bg-[#e8941f] transition-all transform hover:scale-[1.05] shadow-lg shadow-[#FFA62B]/20 uppercase tracking-widest text-[10px] font-sans"
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;