import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordFill } from "react-icons/ri";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { server } from "../../server";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { TbAddressBook } from "react-icons/tb";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { RxPerson } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const ProfileSideBar = ({ active, setActive }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOutHandler = async () => {
    try {
      const res = await axios.get(`${server}/user/logout`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      dispatch({ type: "LogoutSuccess" });
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const navItems = [
    { id: 1, label: "Profile", icon: RxPerson },
    { id: 2, label: "Orders", icon: HiOutlineShoppingBag },
    { id: 3, label: "Refunds", icon: HiOutlineReceiptRefund },
    { id: 4, label: "Inbox", icon: AiOutlineMessage, path: "/inbox" },
    { id: 5, label: "Track Order", icon: MdOutlineTrackChanges },
    { id: 6, label: "Change Password", icon: RiLockPasswordFill },
    { id: 7, label: "Addresses", icon: TbAddressBook },
  ];

  return (
    <div className="w-full bg-white/40 backdrop-blur-xl rounded-[40px] p-6 md:p-8 border border-white shadow-soft sticky top-24">
      <div className="space-y-2">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`w-full flex cursor-pointer items-center p-4 rounded-2xl transition-all duration-300 group ${active === item.id
              ? "bg-[#16697A] text-white shadow-xl translate-x-2"
              : "text-[#16697A] hover:bg-white hover:shadow-soft"
              }`}
            onClick={() => {
              setActive(item.id);
              if (item.path) navigate(item.path);
            }}
          >
            <item.icon size={22} className={`${active === item.id ? "text-[#FFA62B]" : "text-[#489FB5] group-hover:text-[#16697A]"} transition-colors`} />
            <span className={`pl-4 text-sm font-[600] font-sans ${active === item.id ? "text-white" : "text-[#16697A]/60"}`}>
              {item.label}
            </span>
            {active === item.id && (
              <div className="ml-auto w-1.5 h-1.5 bg-[#FFA62B] rounded-full shadow-glow" />
            )}
          </div>
        ))}

        {user && user.role === "Admin" && (
          <Link to="/admin/dashboard" className="block">
            <div className="w-full flex cursor-pointer items-center p-4 rounded-2xl text-[#16697A] hover:bg-white transition-all group">
              <MdOutlineAdminPanelSettings size={22} className="text-[#489FB5] group-hover:text-[#16697A]" />
              <span className="pl-4 text-sm font-[600] font-sans text-[#16697A]/60 group-hover:text-[#16697A]">
                Admin Dashboard
              </span>
            </div>
          </Link>
        )}

        <div className="pt-8 mt-8 border-t border-[#16697A]/10">
          <div
            className="w-full flex cursor-pointer items-center p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all group"
            onClick={logOutHandler}
          >
            <AiOutlineLogin size={22} />
            <span className="pl-4 text-sm font-[600] font-sans opacity-70 group-hover:opacity-100">
              Log out
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSideBar;
