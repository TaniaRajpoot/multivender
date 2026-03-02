import React from "react";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill } from "react-icons/ci";
import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FaProductHunt } from "react-icons/fa";
import { MdEmojiEvents } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
import { FiUsers } from "react-icons/fi";

const AdminSidebar = ({ active }) => {
  const adminMenuItems = [
    { id: 1, label: "Dashboard", icon: RxDashboard, path: "/admin/dashboard" },
    { id: 2, label: "All Orders", icon: FiShoppingBag, path: "/admin-orders" },
    { id: 3, label: "All Sellers", icon: HiOutlineUserGroup, path: "/admin-sellers" },
    { id: 4, label: "All Users", icon: FiUsers, path: "/admin-users" },
    { id: 5, label: "All Products", icon: FaProductHunt, path: "/admin-products" },
    { id: 6, label: "All Events", icon: MdEmojiEvents, path: "/admin-events" },
    { id: 7, label: "Withdrawals", icon: CiMoneyBill, path: "/admin-withdraw-request" },
    { id: 8, label: "Settings", icon: MdOutlineSettings, path: "/admin-settings" },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-96px)] bg-white shadow-soft sticky top-24 left-0 z-30 flex flex-col justify-between py-10 px-4 md:px-6">
      <div className="w-full">
        <div className="hidden md:block mb-10 pl-4 border-l-4 border-[#FFA62B]">
          <h5 className="text-[10px] font-black text-[#16697A] uppercase tracking-[0.4em] leading-none">Management</h5>
          <p className="text-[8px] font-bold text-[#489FB5] uppercase tracking-widest mt-1">Crown Control v2.1</p>
        </div>

        <nav className="space-y-3">
          {adminMenuItems.map((item) => (
            <Link key={item.id} to={item.path} className="block group">
              <div className={`
                flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all duration-500 overflow-hidden relative
                ${active === item.id
                  ? "bg-[#16697A] text-white shadow-[0_20px_40px_rgba(22,105,122,0.25)] translate-x-2"
                  : "text-[#16697A] hover:bg-[#EDE7E3] hover:translate-x-1"
                }
              `}>
                {active === item.id && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FFA62B] shadow-[0_0_20px_#FFA62B]" />
                )}

                <div className={`
                  p-2.5 rounded-xl transition-all duration-500
                  ${active === item.id ? "bg-[#FFA62B] text-white rotate-12 scale-110" : "text-[#489FB5] group-hover:text-[#16697A] group-hover:rotate-6"}
                `}>
                  <item.icon size={22} />
                </div>

                <span className={`
                  text-[13px] font-black uppercase tracking-widest transition-all duration-500 hidden md:block
                  ${active === item.id ? "text-white opacity-100" : "text-[#16697A]/60 group-hover:text-[#16697A]"}
                `}>
                  {item.label}
                </span>

                {active === item.id && (
                  <div className="ml-auto md:block hidden animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFA62B] shadow-[0_0_10px_#FFA62B]" />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      <div className="hidden md:block">
        <div className="bg-gradient-to-br from-[#16697A] to-[#0F4D58] rounded-[32px] p-6 text-center border-t border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
          <div className="w-14 h-14 bg-[#FFA62B]/20 backdrop-blur-md flex items-center justify-center rounded-2xl mx-auto mb-4 text-[#FFA62B] border border-white/10 group-hover:rotate-[360deg] transition-all duration-1000 shadow-xl">
            <MdOutlineSettings size={28} className="animate-spin-slow" />
          </div>
          <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em] leading-relaxed mb-1">System Status</p>
          <h6 className="text-[11px] font-black text-white uppercase tracking-widest">Shield Engaged</h6>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FF00] shadow-[0_0_8px_#00FF00]" />
            <span className="text-[8px] font-bold text-[#82C0CC] uppercase tracking-tighter">Verified Node</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;