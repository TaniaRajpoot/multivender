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

  // Helper function to get image URL
  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    
    // If it's an object with url property (Cloudinary format)
    if (typeof image === "object" && image.url) {
      return image.url;
    }
    
    // If it's already a URL string (starts with http)
    if (typeof image === "string" && image.startsWith("http")) {
      return image;
    }
    
    // Fallback for old backend format
    return `${backend_url}${image}`;
  };

  if (!seller) {
    return null; // or a loading indicator
  }

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      
      {/* Logo */}
      <div>
        <Link to="/dashboard">
          <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt="Logo"
            className="h-[50px]"
          />
        </Link>
      </div>

      {/* Icons & Avatar */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Icons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link to="/dashboard/cupouns" className="hidden md:block">
            <AiOutlineGift color="#555" size={28} className="cursor-pointer hover:text-blue-500 transition" />
          </Link>
          <Link to="/dashboard-events" className="hidden md:block">
            <MdOutlineLocalOffer color="#555" size={28} className="cursor-pointer hover:text-blue-500 transition" />
          </Link>
          <Link to="/dashboard-products" className="hidden md:block">
            <FiShoppingBag color="#555" size={28} className="cursor-pointer hover:text-blue-500 transition" />
          </Link>
          <Link to="/dashboard-orders" className="hidden md:block">
            <FiPackage color="#555" size={28} className="cursor-pointer hover:text-blue-500 transition" />
          </Link>
          <Link to="/dashboard-messages" className="hidden md:block">
            <BiMessageSquareDetail color="#555" size={28} className="cursor-pointer hover:text-blue-500 transition" />
          </Link>
        </div>

        {/* Seller Avatar */}
        <Link to={`/shop/${seller._id}`}>
          <img
            src={getImageUrl(seller.avatar)}
            alt="Seller Avatar"
            className="w-[50px] h-[50px] rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              e.target.src = "/placeholder.png"; // Fallback if image fails to load
            }}
          />
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;