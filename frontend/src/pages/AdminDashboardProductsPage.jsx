import React from "react";
import AdminLayout from "../components/ui/AdminLayout";
import AllProducts from "../components/Admin/AllProducts";

const AdminDashboardProductsPage = () => (
  <AdminLayout sidebarActive={5}>
    <AllProducts />
  </AdminLayout>
);

export default AdminDashboardProductsPage;
