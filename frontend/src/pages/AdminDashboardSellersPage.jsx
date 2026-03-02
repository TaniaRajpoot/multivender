import React from "react";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar";
import AdminHeader from "../components/Layout/AdminHeader";
import AllSellers from "../components/Admin/AllSellers";

const AdminDashboardSellerPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex items-start">
        <div className="w-[80px] lg:w-[330px] sticky top-24 z-20">
          <AdminSidebar active={3} />
        </div>
        <AllSellers />
      </div>
    </div>
  );
};

export default AdminDashboardSellerPage;