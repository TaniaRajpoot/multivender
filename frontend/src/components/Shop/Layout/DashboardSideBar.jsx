import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineReceiptRefund, HiOutlineLogout } from "react-icons/hi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { logoutSeller } from "../../../redux/actions/seller";
import { ui } from "../../../styles/theme";

const ShopDashboardSidebar = ({ active }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const logoutHandler = () => {
    dispatch(logoutSeller());
    window.location.href = "/shop-login";
  };

  const menuItems = [
    { id: 1, label: "Overview", path: "/dashboard", icon: RxDashboard },
    { id: 2, label: "Orders", path: "/dashboard-orders", icon: FiShoppingBag },
    { id: 3, label: "Products", path: "/dashboard-products", icon: FiPackage },
    { id: 4, label: "Add product", path: "/dashboard-create-product", icon: AiOutlineFolderAdd },
    { id: 5, label: "Events", path: "/dashboard-events", icon: MdOutlineLocalOffer },
    { id: 6, label: "Create event", path: "/dashboard-create-event", icon: VscNewFile },
    { id: 7, label: "Payments", path: "/dashboard-withdraw-money", icon: CiMoneyBill },
    { id: 8, label: "Messages", path: "/dashboard-messages", icon: BiMessageSquareDetail },
    { id: 9, label: "Discount codes", path: "/dashboard-coupons", icon: AiOutlineGift },
    { id: 10, label: "Refunds", path: "/dashboard-refunds", icon: HiOutlineReceiptRefund },
    { id: 11, label: "Shop settings", path: "/settings", icon: CiSettings },
  ];

  return (
    <div className={`${ui.card} min-h-[calc(100vh-120px)] p-4 sticky top-24`}>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 px-2">Shop menu</p>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = active === item.id || location.pathname === item.path;
          return (
            <Link key={item.id} to={item.path} className={isActive ? ui.sidebarLinkActive : ui.sidebarLink}>
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={logoutHandler}
        className="flex items-center gap-3 w-full mt-6 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        <HiOutlineLogout size={20} />
        Log out
      </button>
    </div>
  );
};

export default ShopDashboardSidebar;
