import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminHeader = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <header className="bg-teal-900 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/admin/dashboard" className="font-semibold text-lg">
          Admin panel
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className="text-teal-200 hover:text-white">View store</Link>
          <span className="text-teal-200 hidden sm:inline">{user?.name || "Admin"}</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
