import React from "react";
import AdminLayout from "../components/ui/AdminLayout";
import AllUsers from "../components/Admin/AllUsers";

const AdminDashboardUsersPage = () => (
  <AdminLayout sidebarActive={4}>
    <AllUsers />
  </AdminLayout>
);

export default AdminDashboardUsersPage;
