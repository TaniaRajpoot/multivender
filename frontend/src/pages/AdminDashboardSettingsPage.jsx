import React from "react";
import AdminLayout from "../components/ui/AdminLayout";
import { ui } from "../styles/theme";

const AdminDashboardSettingsPage = () => (
  <AdminLayout sidebarActive={8}>
    <div className="space-y-6">
      <div>
        <h1 className={ui.titleSm}>Settings</h1>
        <p className={ui.subtitle}>Basic admin preferences (demo placeholders).</p>
      </div>
      <div className={`${ui.card} ${ui.cardPadding} max-w-lg space-y-4`}>
        <div>
          <label className={ui.label}>Display name</label>
          <input type="text" className={ui.input} defaultValue="System Admin" />
        </div>
        <div>
          <label className={ui.label}>Contact email</label>
          <input type="email" className={ui.input} defaultValue="admin@shop.com" />
        </div>
        <button type="button" className={ui.btnPrimary}>Save changes</button>
      </div>
    </div>
  </AdminLayout>
);

export default AdminDashboardSettingsPage;
