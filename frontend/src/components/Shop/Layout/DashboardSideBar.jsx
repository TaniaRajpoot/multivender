import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { BiMessageSquareDetail } from "react-icons/bi";

const ShopDashboardSidebar = ({ active }) => {
  const menuItems = [
    { id: 1, label: "Dashboard", icon: RxDashboard, path: "/dashboard" },
    { id: 2, label: "All Orders", icon: FiShoppingBag, path: "/dashboard-orders" },
    { id: 3, label: "All Products", icon: FiPackage, path: "/dashboard-products" },
    { id: 4, label: "Create Product", icon: AiOutlineFolderAdd, path: "/dashboard-create-product" },
    { id: 5, label: "All Events", icon: MdOutlineLocalOffer, path: "/dashboard-events" },
    { id: 6, label: "Create Event", icon: VscNewFile, path: "/dashboard-create-event" },
    { id: 7, label: "Withdraw Money", icon: CiMoneyBill, path: "/dashboard-withdraw-money" },
    { id: 8, label: "Shop Inbox", icon: BiMessageSquareDetail, path: "/dashboard-messages" },
    { id: 9, label: "Discount Codes", icon: AiOutlineGift, path: "/dashboard-coupons" },
    { id: 10, label: "Refunds", icon: HiOutlineReceiptRefund, path: "/dashboard-refunds" },
    { id: 11, label: "Settings", icon: CiSettings, path: "/settings" },
  ];

  return (
    <div className="w-full min-h-screen bg-white shadow-sm border-r sticky top-0 left-0 z-10 800px:p-4 overflow-y-auto">
      <div className="hidden 800px:block mb-8 pl-4 pt-8">
        <p className="text-[10px] font-black text-[#16697A]/60 uppercase tracking-[0.4em]">Shop Dashboard</p>
      </div>

      <nav className="space-y-2 pt-8 800px:pt-0">
        {menuItems.map((item) => (
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
                ${active === item.id ? "bg-[#FFA62B] text-white rotate-6" : "text-[#489FB5] group-hover:text-[#16697A]"}
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
                <div className="hidden 800px:block ml-auto w-1 h-6 bg-[#FFA62B] rounded-full shadow-glow" />
              )}
            </div>
          </Link>
        ))}
      </nav>

      <div className="hidden 800px:block pt-20 mt-8 border-t border-[#16697A]/10">
        <div className="bg-[#EDE7E3]/60 rounded-3xl p-6 border border-white text-center">
          <div className="w-12 h-12 bg-[#FFA62B]/20 flex items-center justify-center rounded-2xl mx-auto mb-4 text-[#FFA62B]">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414-1.414l.707.707a1 1 0 01-1.414 1.414l-.707-.707zM16.343 16.343a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414z" /></svg>
          </div>
          <p className="text-[10px] font-black text-[#16697A]/40 uppercase tracking-widest leading-relaxed">Store Secured</p>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboardSidebar;