import React from "react";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill } from "react-icons/ci";
import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { GrWorkshop } from "react-icons/gr";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FaProductHunt } from "react-icons/fa";
import { MdEmojiEvents } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";

const AdminSidebar = ({ active }) => {
  const adminMenuItems = [
    { id: 1, label: "Dashboard", icon: RxDashboard, path: "/admin/dashboard" },
    { id: 2, label: "All Orders", icon: FiShoppingBag, path: "/admin-orders" },
    { id: 3, label: "All Sellers", icon: HiOutlineUserGroup, path: "/admin-sellers" },
    { id: 4, label: "All Users", icon: GrWorkshop, path: "/admin-users" },
    { id: 5, label: "All Products", icon: FaProductHunt, path: "/admin-products" },
    { id: 6, label: "All Events", icon: MdEmojiEvents, path: "/admin-events" },
    { id: 7, label: "Withdraw Request", icon: CiMoneyBill, path: "/admin-withdraw-request" },
    { id: 8, label: "Settings", icon: MdOutlineSettings, path: "/admin-settings" },
  ];

  return (
    <div className="w-full min-h-screen bg-white shadow-sm border-r sticky top-0 left-0 z-10 800px:p-4 overflow-y-auto">
      <div className="hidden 800px:block mb-8 pl-4 pt-8">
        <p className="text-[10px] font-black text-[#16697A]/60 uppercase tracking-[0.4em]">Admin Panel</p>
      </div>

      <nav className="space-y-2 pt-8 800px:pt-0">
        {adminMenuItems.map((item) => (
          <Link key={item.id} to={item.path} className="block group">
            <div className={`
                flex items-center 800px:gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group
                ${active === item.id
                ? "bg-[#16697A] text-white shadow-xl translate-x-1"
                : "text-[#16697A] hover:bg-[#EDE7E3]/50"
              }
              `}>
              <div className={`
                  p-2 rounded-xl transition-all duration-300
                  ${active === item.id ? "bg-[#FFA62B] text-white rotate-6 shadow-glow" : "text-[#489FB5] group-hover:text-[#16697A]"}
                `}>
                <item.icon size={20} />
              </div>
              <span className={`
                hidden 800px:block text-[13px] font-black uppercase tracking-widest transition-all
                ${active === item.id ? "text-white" : "text-[#16697A]/60"}
              `}>
                {item.label}
              </span>
              {active === item.id && (
                <div className="hidden 800px:block ml-auto w-1.5 h-1.5 bg-[#FFA62B] rounded-full shadow-glow" />
              )}
            </div>
          </Link>
        ))}
      </nav>

      <div className="hidden 800px:block pt-20 mt-8 border-t border-[#16697A]/10">
        <div className="bg-[#EDE7E3]/60 rounded-3xl p-6 border border-white text-center">
          <div className="w-12 h-12 bg-[#82C0CC]/10 flex items-center justify-center rounded-2xl mx-auto mb-4 text-[#82C0CC]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <p className="text-[10px] font-black text-[#16697A]/40 uppercase tracking-widest leading-relaxed">System Shield Active</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;