import React from "react";
import { Link } from "react-router-dom";
import { ui } from "../../styles/theme";

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
    <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
      <Link to="/" className="inline-flex items-center gap-2 text-teal-700 font-semibold text-lg mb-6">
        <span className="w-10 h-10 rounded-lg bg-teal-700 text-white flex items-center justify-center text-sm font-bold">M</span>
        MultiVendor Shop
      </Link>
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
    </div>
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className={`${ui.card} ${ui.cardPadding}`}>{children}</div>
      {footer && <div className="mt-6 text-center text-sm text-gray-600">{footer}</div>}
    </div>
  </div>
);

export default AuthLayout;
