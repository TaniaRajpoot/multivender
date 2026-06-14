import React from "react";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";

/** Standard storefront page: header + content + footer */
const StoreLayout = ({ activeHeading, children, showFooter = true }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Header activeHeading={activeHeading} />
    <main className="flex-1">{children}</main>
    {showFooter && <Footer />}
  </div>
);

export default StoreLayout;
