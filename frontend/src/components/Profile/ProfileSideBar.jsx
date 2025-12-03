import React from "react";
import { HiOutlineShoppingBag, HiOutlineReceiptRefund } from "react-icons/hi";
import { RxPerson } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { MdOutlineTrackChanges } from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { AiOutlineCreditCard, AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { useDispatch } from "react-redux";

const ProfileSideBar = ({ setActive, active }) => {
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

  return (
    <div className="w-full bg-white shadow-sm rounded-[10px] p-3 pt-5">

      <div
        className="flex items-center cursor-pointer w-full mb-5"
        onClick={() => setActive(1)}
      >
        <RxPerson size={20} color={active === 1 ? "red" : "#555"} className="flex-shrink-0" />
        <span className={`pl-3 ${active === 1 ? "text-red-500" : "text-[#555]"} text-[15px] lg:block md:block sm:block hidden`}>
          Profile
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-5"
        onClick={() => setActive(2)}
      >
        <HiOutlineShoppingBag size={20} color={active === 2 ? "red" : "#555"} className="flex-shrink-0" />
        <span className={`pl-3 ${active === 2 ? "text-red-500" : "text-[#555]"} text-[15px] lg:block md:block sm:block hidden`}>
          Orders
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-5"
        onClick={() => setActive(3)}
      >
        <HiOutlineReceiptRefund size={20} color={active === 3 ? "red" : "#555"} className="flex-shrink-0" />
        <span className={`pl-3 ${active === 3 ? "text-red-500" : "text-[#555]"} text-[15px] lg:block md:block sm:block hidden`}>
          Refunds
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-5"
        onClick={() => setActive(4)}
      >
        <AiOutlineMessage size={20} color={active === 4 ? "red" : "#555"} className="flex-shrink-0" />
        <span className={`pl-3 ${active === 4 ? "text-red-500" : "text-[#555]"} text-[15px] lg:block md:block sm:block hidden`}>
          Inbox
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-5"
        onClick={() => setActive(5)}
      >
        <MdOutlineTrackChanges size={20} color={active === 5 ? "red" : "#555"} className="flex-shrink-0" />
        <span className={`pl-3 ${active === 5 ? "text-red-500" : "text-[#555]"} text-[15px] lg:block md:block sm:block hidden`}>
          Track Order
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-5"
        onClick={() => setActive(6)}
      >
        <AiOutlineCreditCard size={20} color={active === 6 ? "red" : "#555"} className="flex-shrink-0" />
        <span className={`pl-3 ${active === 6 ? "text-red-500" : "text-[#555]"} text-[15px] lg:block md:block sm:block hidden`}>
          Payment Methods
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-5"
        onClick={() => setActive(7)}
      >
        <TbAddressBook size={20} color={active === 7 ? "red" : "#555"} className="flex-shrink-0" />
        <span className={`pl-3 ${active === 7 ? "text-red-500" : "text-[#555]"} text-[15px] lg:block md:block sm:block hidden`}>
          Address
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-5"
        onClick={logOutHandler}
      >
        <AiOutlineLogin size={20} color={active === 8 ? "red" : "#555"} className="flex-shrink-0" />
        <span className={`pl-3 ${active === 8 ? "text-red-500" : "text-[#555]"} text-[15px] lg:block md:block sm:block hidden`}>
          Log out
        </span>
      </div>

    </div>
  );
};

export default ProfileSideBar;