import React from "react";
import AdminLayout from "../components/ui/AdminLayout";
import AllWithdraw from "../components/Admin/AllWithdraw";

const AdminDashboardWithdrawPage = () => (
  <AdminLayout sidebarActive={7}>
    <AllWithdraw />
  </AdminLayout>
);

export default AdminDashboardWithdrawPage;
