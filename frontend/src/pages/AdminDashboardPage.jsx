import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar.jsx";
import AdminDashBoardMain from "../components/Admin/Layout/AdminDashBoardMain.jsx";
const AdminDashboardPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="w-[80px] lg:w-[330px] sticky top-0 z-20">
          <AdminSidebar active={1} />
        </div>
        <div className="flex-1 p-4">
          <AdminDashBoardMain />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;