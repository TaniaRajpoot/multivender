import React from "react";
import AdminLayout from "../components/ui/AdminLayout";
import AllSellers from "../components/Admin/AllSellers";

const AdminDashboardSellerPage = () => (
  <AdminLayout sidebarActive={3}>
    <AllSellers />
  </AdminLayout>
);

export default AdminDashboardSellerPage;
