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
    <div className={`w-full bg-white/70 backdrop-blur-xl border border-white rounded-[48px] overflow-hidden shadow-soft hover:shadow-2xl transition-all duration-700 flex flex-col lg:flex-row gap-12 p-8 md:p-12 mb-12 group`}>

      {/* Visual Identity Section */}
      <div className="w-full lg:w-[45%] relative group">
        <div className="w-full h-[400px] lg:h-[500px] rounded-[32px] overflow-hidden bg-[#EDE7E3]/30 border-4 border-white shadow-inner flex items-center justify-center relative">
          <img
            src={`${data.images[0]?.url}`}
            alt={data?.name}
            className="w-full h-full object-cover transform scale-[1.05] group-hover:scale-110 transition-transform duration-1000"
          />
          <div className="absolute top-6 left-6 px-6 py-2 bg-[#FFA62B] text-white text-[10px] font-[700] uppercase tracking-[0.3em] rounded-full shadow-xl font-sans">
            Event
          </div>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-1 bg-[#FFA62B] rounded-full" />
            <p className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-[0.4em] font-sans">Flash Deal</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-[700] text-[#16697A] tracking-tight leading-none italic font-display group-hover:text-[#FFA62B] transition-colors duration-500">
            {data?.name}
          </h2>
        </div>

        <p className="text-lg font-medium text-[#6B7280] leading-relaxed line-clamp-4 italic border-l-4 border-[#16697A]/5 pl-6">
          "{data?.description}"
        </p>

        {/* Pricing Matrix */}
        <div className="flex items-end gap-6 border-b border-[#16697A]/5 pb-8">
          <div className="space-y-1">
            <p className="text-[10px] font-[700] text-[#82C0CC] uppercase tracking-widest ml-1 font-sans">Price</p>
            <div className="flex items-center gap-4">
              <h5 className="text-3xl font-[700] text-[#16697A] tracking-tight font-display italic font-sans">${data.discountPrice}</h5>
              <h5 className="text-xl font-[600] text-[#6B7280]/40 line-through opacity-50 font-sans">${data.originalPrice}</h5>
            </div>
          </div>
          <div className="pb-1">
            <span className="px-4 py-1.5 bg-[#489FB5]/10 text-[#489FB5] text-[10px] font-[700] uppercase tracking-[0.2em] rounded-full font-sans">
              {data?.sold_out || 0} Sold
            </span>
          </div>
        </div>

        {/* Temporal Synchrony (Countdown) */}
        <div className="relative p-6 bg-[#16697A] rounded-[32px] shadow-2xl overflow-hidden group/timer">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover/timer:scale-150 transition-transform duration-1000" />
          <p className="text-[9px] font-[700] text-[#82C0CC] uppercase tracking-[0.4em] mb-4 text-center font-sans tracking-[0.3em]">Ending In</p>
          <CountDown data={data} />
        </div>

        {/* Tactical Actions */}
        <div className="flex gap-4 pt-4">
          <Link to={`/product/${data._id}?isEvent=true`} className="flex-[1.5]">
            <button className="w-full h-16 bg-[#16697A] text-[#EDE7E3] font-[700] rounded-2xl hover:bg-[#FFA62B] transition-all transform hover:scale-[1.02] shadow-xl uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 font-sans">
              See Details <HiOutlineArrowNarrowRight size={20} />
            </button>
          </Link>
          <button
            onClick={() => addToCartHandler(data)}
            className="flex-1 h-16 border-2 border-[#16697A] text-[#16697A] font-[700] rounded-2xl hover:bg-[#16697A] hover:text-white transition-all transform hover:scale-[1.02] uppercase tracking-[0.2em] text-[10px] font-sans"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;