import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { backend_url } from "../../../server";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);

  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    if (typeof image === "object" && image.url) return image.url;
    if (typeof image === "string" && image.startsWith("http")) return image;
    return `${backend_url}${image}`;
  };

  if (!seller) return null;

  return (
    <div className="w-full h-24 bg-[#16697A] shadow-soft sticky top-0 left-0 z-50 flex items-center justify-between px-8 md:px-12 border-b border-white/5">

      {/* Brand Identity / Logo */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center p-2 group-hover:bg-[#FFA62B] transition-all duration-500 shadow-xl">
            <img src="/logo-icon.png" alt="" className="w-full h-full object-contain brightness-0 invert" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter leading-none italic">CROWN<span className="text-[#FFA62B]">MARKET</span></h1>
            <p className="text-[10px] font-black text-[#82C0CC] uppercase tracking-[0.3em] mt-1">Vendor Elite</p>
          </div>
        </Link>
      </div>

      {/* Global Navigation & Profile */}
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 bg-white/5 rounded-2xl p-1.5 backdrop-blur-sm border border-white/5">
          <NavIcon to="/dashboard/cupouns" icon={AiOutlineGift} label="Discount Codes" />
          <NavIcon to="/dashboard-events" icon={MdOutlineLocalOffer} label="All Events" />
          <NavIcon to="/dashboard-products" icon={FiShoppingBag} label="All Products" />
          <NavIcon to="/dashboard-orders" icon={FiPackage} label="All Orders" />
          <NavIcon to="/dashboard-messages" icon={BiMessageSquareDetail} label="Shop Inbox" />
        </div>

        {/* Profile Interaction */}
        <Link to={`/shop/${seller._id}`} className="group flex items-center gap-4 bg-[#0F4D58] hover:bg-[#FFA62B] p-1.5 pr-6 rounded-2xl transition-all duration-500 shadow-xl border border-white/5">
          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg group-hover:scale-95 transition-transform duration-500">
            <img
              src={getImageUrl(seller.avatar)}
              alt="Seller"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "/placeholder.png"; }}
            />
          </div>
          <div className="hidden md:block">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">{seller.name}</h4>
            <p className="text-[10px] font-bold text-[#82C0CC] group-hover:text-white transition-colors uppercase">Store Master</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

const NavIcon = ({ to, icon: Icon, label }) => (
  <Link to={to} className="relative group p-3 text-[#82C0CC] hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300">
    <Icon size={22} />
    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-[#0F4D58] text-[8px] font-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest pointer-events-none whitespace-nowrap z-50">
      {label}
    </span>
  </Link>
);

export default DashboardHeader;