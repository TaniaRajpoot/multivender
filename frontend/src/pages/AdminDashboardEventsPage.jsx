import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar";
import AllEvents from "../components/Admin/AllEvents";


const AdminDashboardEventsPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="w-20 md:w-[100px] lg:w-[330px]">
          <AdminSidebar active={6} />
        </div>
        <AllEvents/>
      </div>
    </div>
  );
};

export default AdminDashboardEventsPage;