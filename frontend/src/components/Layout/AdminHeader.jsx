import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { Link } from "react-router-dom";
import { backend_url } from "../../server";
import { useSelector } from "react-redux";

const AdminHeader = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="w-full h-24 bg-[#16697A] shadow-soft sticky top-0 left-0 z-50 flex items-center justify-between px-8 md:px-12 border-b border-white/5">

      {/* Brand Identity / Logo */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center p-2 group-hover:bg-[#FFA62B] transition-all duration-500 shadow-xl">
            <img src="/logo.png" alt="" className="w-full h-full object-contain brightness-0 invert" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter leading-none italic">CROWN<span className="text-[#FFA62B]">MARKET</span></h1>
            <p className="text-[10px] font-black text-[#82C0CC] uppercase tracking-[0.3em] mt-1">Admin Central</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 bg-white/5 rounded-2xl p-1.5 backdrop-blur-sm border border-white/5">
          <NavIcon to="/dashboard-coupons" icon={AiOutlineGift} label="Coupons" />
          <NavIcon to="/dashboard-events" icon={MdOutlineLocalOffer} label="Events" />
          <NavIcon to="/dashboard-products" icon={FiShoppingBag} label="Products" />
          <NavIcon to="/dashboard-orders" icon={FiPackage} label="Orders" />
          <NavIcon to="/dashboard-messages" icon={BiMessageSquareDetail} label="Messages" />
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4 bg-[#0F4D58] p-1.5 pr-6 rounded-2xl border border-white/5">
          <img
            src={user?.avatar?.url || user?.avatar}
            className="w-12 h-12 rounded-xl border-2 border-white/20 shadow-lg object-cover"
            alt="Admin"
          />
          <div className="hidden md:block">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">{user?.name}</h4>
            <p className="text-[10px] font-bold text-[#82C0CC] uppercase">System Admin</p>
          </div>
        </div>
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

export default AdminHeader;