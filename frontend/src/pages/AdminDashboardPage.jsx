import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar.jsx";
import AdminDashBoardMain from "../components/Admin/Layout/AdminDashBoardMain.jsx";
const AdminDashboardPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="800px:w-[330px] w-[80px]">
          <AdminSidebar active={1} />
        </div>
        <AdminDashBoardMain />
      </div>
    </div>
  );
};

export default AdminDashboardPage;