import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar";
import AllProducts from "../components/Admin/AllProducts";
const AdminDashboardProductsPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex items-start">
        <div className="w-[80px] lg:w-[330px] sticky top-24 z-20">
          <AdminSidebar active={5} />
        </div>
        <AllProducts />
      </div>
    </div>
  );
};

export default AdminDashboardProductsPage;