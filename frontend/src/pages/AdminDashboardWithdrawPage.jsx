import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar";
import AllWithdraw from "../components/Admin/AllWithdraw";
const AdminDashboardWithdrawPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex items-start">
        <div className="w-[80px] lg:w-[330px] sticky top-24 z-20">
          <AdminSidebar active={7} />
        </div>
        <AllWithdrawRequest />
      </div>
    </div>
  );
};

export default AdminDashboardWithdrawPage;