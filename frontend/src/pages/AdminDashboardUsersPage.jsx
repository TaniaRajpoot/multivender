import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar";
import AllUsers from "../components/Admin/AllUsers";
const AdminDashboardUsersPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex items-start">
        <div className="w-[80px] lg:w-[330px] sticky top-24 z-20">
          <AdminSidebar active={4} />
        </div>
        <AllUsers />
      </div>
    </div>
  );
};
export default AdminDashboardUsersPage;