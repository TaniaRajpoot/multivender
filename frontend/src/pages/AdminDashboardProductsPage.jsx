import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar";
import AllProducts from "../components/Admin/AllProducts";
const AdminDashboardProductsPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="w-20 md:w-[100px] lg:w-[330px]">
          <AdminSidebar active={5} />
        </div>
        <AllProducts/>
      </div>
    </div>
  );
};

export default AdminDashboardProductsPage;