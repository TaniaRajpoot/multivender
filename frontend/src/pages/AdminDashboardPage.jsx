import React from "react";
import AdminLayout from "../components/ui/AdminLayout";
import AdminDashboardMain from "../components/Admin/Layout/AdminDashBoardMain";

const AdminDashboardPage = () => (
  <AdminLayout sidebarActive={1}>
    <AdminDashboardMain />
  </AdminLayout>
);

export default AdminDashboardPage;
