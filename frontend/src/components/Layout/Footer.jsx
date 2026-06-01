import React from "react";
import { AiFillFacebook, AiOutlineInstagram, AiOutlineTwitter, AiOutlineYoutube } from "react-icons/ai";
import { footercompanyLinks, footerProductLinks, footerSupportLinks } from "../../static/data";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:flex md:items-center md:justify-between gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Get updates by email</h2>
          <p className="text-sm mt-1">New products, sales, and shop news.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-0">
          <input
            type="email"
            placeholder="Your email address"
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm min-w-[220px] focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 outline-none"
          />
          <button type="button" className="rounded-lg bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-800">
            Subscribe
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-gray-100">
        <div>
          <img src="/logo.png" alt="MultiVendor Shop" className="w-24 mb-4" />
          <p className="text-sm leading-relaxed">A simple marketplace to buy from many sellers in one place.</p>
          <div className="flex gap-4 mt-4 text-gray-500">
            <AiFillFacebook size={22} className="hover:text-teal-700 cursor-pointer" />
            <AiOutlineTwitter size={22} className="hover:text-teal-700 cursor-pointer" />
            <AiOutlineInstagram size={22} className="hover:text-teal-700 cursor-pointer" />
            <AiOutlineYoutube size={22} className="hover:text-teal-700 cursor-pointer" />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            {footerProductLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.link} className="hover:text-teal-700">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            {footercompanyLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.link} className="hover:text-teal-700">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Help</h4>
          <ul className="space-y-2 text-sm">
            {footerSupportLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.link} className="hover:text-teal-700">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} MultiVendor Shop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
