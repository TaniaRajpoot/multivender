import React from "react";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar";
import AdminHeader from "../components/Layout/AdminHeader";
import AllSellers from "../components/Admin/AllSellers";

const AdminDashboardSellerPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="w-20 md:w-[100px] lg:w-[330px]">
          <AdminSidebar active={3} />
        </div>
        <AllSellers />
      </div>
    </div>
  );
};

export default AdminDashboardSellerPage;