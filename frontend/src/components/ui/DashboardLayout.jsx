import React from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Simple sidebar layout for seller & admin dashboards
 */
const DashboardLayout = ({ title, menuItems, children, header }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {header}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 p-4 sm:p-6">
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sticky top-24">
            {title && (
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 px-2">
                {title}
              </p>
            )}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={
                      active
                        ? "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold bg-teal-700 text-white"
                        : "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    }
                  >
                    {item.icon && <item.icon size={20} />}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
