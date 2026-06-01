import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdOutlineAdminPanelSettings, MdOutlineTrackChanges } from "react-icons/md";
import { server } from "../../server";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { TbAddressBook } from "react-icons/tb";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { RxPerson } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ui } from "../../styles/theme";

const ProfileSideBar = ({ active, setActive }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOutHandler = async () => {
    try {
      const res = await axios.get(`${server}/user/logout`, { withCredentials: true });
      toast.success(res.data.message || "Logged out");
      dispatch({ type: "LogoutSuccess" });
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const navItems = [
    { id: 1, label: "My profile", icon: RxPerson },
    { id: 2, label: "My orders", icon: HiOutlineShoppingBag },
    { id: 3, label: "Refunds", icon: HiOutlineReceiptRefund },
    { id: 4, label: "Messages", icon: AiOutlineMessage, path: "/inbox" },
    { id: 5, label: "Track order", icon: MdOutlineTrackChanges },
    { id: 6, label: "Change password", icon: RiLockPasswordFill },
    { id: 7, label: "Saved addresses", icon: TbAddressBook },
  ];

  return (
    <div className={`${ui.card} p-4 sticky top-24`}>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">Account menu</p>
      <div className="space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={active === item.id ? ui.sidebarLinkActive + " w-full text-left" : ui.sidebarLink + " w-full text-left"}
            onClick={() => {
              setActive(item.id);
              if (item.path) navigate(item.path);
            }}
          >
            <item.icon size={20} className="shrink-0" />
            <span>{item.label}</span>
          </button>
        ))}

        {user?.role === "Admin" && (
          <Link to="/admin/dashboard" className={ui.sidebarLink}>
            <MdOutlineAdminPanelSettings size={20} />
            <span>Admin panel</span>
          </Link>
        )}

        <div className="border-t border-gray-200 mt-4 pt-4">
          <button type="button" onClick={logOutHandler} className="flex items-center gap-3 w-full rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50">
            <AiOutlineLogin size={20} />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSideBar;
