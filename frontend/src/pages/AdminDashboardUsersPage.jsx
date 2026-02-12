import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar";
import AllUsers from "../components/Admin/AllUsers";
const AdminDashboardUsersPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="w-20 md:w-[100px] lg:w-[330px]">
          <AdminSidebar active={4} />
        </div>
        <AllUsers />
      </div>
    </div>
  );
};
export default AdminDashboardUsersPage;