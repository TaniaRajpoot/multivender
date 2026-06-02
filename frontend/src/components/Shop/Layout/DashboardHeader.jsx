import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-teal-800 font-semibold">
          <img src="/logo.png" alt="" className="h-8" />
          <span className="hidden sm:inline">Back to store</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to={`/shop/${seller?._id}`} className="flex items-center gap-3 hover:opacity-80 transition-all">
            <span className="text-sm font-medium text-gray-600 hidden sm:inline">
              {seller?.name || "Seller"}
            </span>
            <img 
              src={seller?.avatar?.url || seller?.avatar || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"} 
              alt="Shop Profile" 
              className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm" 
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
