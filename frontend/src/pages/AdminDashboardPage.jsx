import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar.jsx";
import AdminDashBoardMain from "../components/Admin/Layout/AdminDashBoardMain.jsx";
const AdminDashboardPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="w-20 md:w-[100px] lg:w-[330px]">
          <AdminSidebar active={1} />
        </div>
        <AdminDashBoardMain />
      </div>
    </div>
  );
};

export default AdminDashboardPage;