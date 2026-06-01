import React from "react";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill } from "react-icons/ci";
import { Link, useLocation } from "react-router-dom";
import { FiShoppingBag, FiUsers } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FaProductHunt } from "react-icons/fa";
import { MdEmojiEvents, MdOutlineSettings } from "react-icons/md";
import { ui } from "../../../styles/theme";

const AdminSidebar = ({ active }) => {
  const location = useLocation();

  const adminMenuItems = [
    { id: 1, label: "Overview", path: "/admin/dashboard", icon: RxDashboard },
    { id: 2, label: "All orders", path: "/admin-orders", icon: FiShoppingBag },
    { id: 3, label: "All sellers", path: "/admin-sellers", icon: HiOutlineUserGroup },
    { id: 4, label: "All users", path: "/admin-users", icon: FiUsers },
    { id: 5, label: "All products", path: "/admin-products", icon: FaProductHunt },
    { id: 6, label: "All events", path: "/admin-events", icon: MdEmojiEvents },
    { id: 7, label: "Withdrawals", path: "/admin-withdraw-request", icon: CiMoneyBill },
    { id: 8, label: "Settings", path: "/admin-settings", icon: MdOutlineSettings },
  ];

  return (
    <div className={`${ui.card} min-h-[calc(100vh-120px)] p-4 sticky top-24`}>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 px-2">Admin menu</p>
      <nav className="space-y-1">
        {adminMenuItems.map((item) => {
          const isActive = active === item.id || location.pathname === item.path;
          return (
            <Link key={item.id} to={item.path} className={isActive ? ui.sidebarLinkActive : ui.sidebarLink}>
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
