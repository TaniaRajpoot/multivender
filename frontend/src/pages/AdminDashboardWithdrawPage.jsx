import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar";
import AllWithdraw from "../components/Admin/AllWithdraw";
const AdminDashboardWithdrawPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="w-20 md:w-[100px] lg:w-[330px]">
          <AdminSidebar active={7} />
        </div>
        <AllWithdraw />
      </div>
    </div>
  );
};

export default AdminDashboardWithdrawPage;