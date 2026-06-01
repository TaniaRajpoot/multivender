import React from "react";
import AdminLayout from "../components/ui/AdminLayout";
import AllEvents from "../components/Admin/AllEvents";

const AdminDashboardEventsPage = () => (
  <AdminLayout sidebarActive={6}>
    <AllEvents />
  </AdminLayout>
);

export default AdminDashboardEventsPage;
