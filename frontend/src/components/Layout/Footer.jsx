import React from "react";
import {
  AiFillFacebook,
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineTwitter,
  AiOutlineYoutube,
} from "react-icons/ai";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="w-full bg-[#EDE7E3] text-[#6B7280] font-sans border-t border-[#16697A]/10">
      {/* ── Subscribe Section ── */}
      <div className="w-full bg-[#EDE7E3] py-6 px-10 md:flex md:justify-between md:items-center">
        <h1 className="text-2xl lg:text-3xl md:mb-0 mb-8 leading-tight font-[700] md:w-3/5 italic font-display tracking-tight text-[#16697A]">
          <span className="text-[#FFA62B]">Subscribe</span> us for getting new{" "}
          <br className="hidden lg:block" /> events and offers
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            required
            placeholder="Enter your email..."
            className="bg-white text-[#16697A] border border-[#16697A]/10 sm:w-80 py-4 px-6 rounded-full focus:outline-none focus:border-[#FFA62B] transition-all placeholder:text-[#16697A]/40 font-sans text-sm shadow-inner"
          />
          <button className="bg-[#FFA62B] hover:bg-[#e8941f] duration-500 px-10 py-4 rounded-full text-white font-[700] uppercase tracking-widest text-[12px] shadow-lg shadow-orange-950/20 whitespace-nowrap">
            Submit
          </button>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:px-8 px-5 py-8">
        <div className="flex flex-col gap-6">
          <img
            src="/logo.png"
            alt="Crown Market"
            className="w-28 opacity-90"
          />
          <p className="text-[#6B7280] text-[15px] leading-relaxed max-w-[280px] font-[500] italic font-sans">
            The home and elements to create beautiful products
          </p>
          <div className="flex items-center gap-5 mt-4">
            <AiFillFacebook size={22} className="text-[#16697A]/60 cursor-pointer hover:text-[#FFA62B] transition-colors" />
            <AiOutlineTwitter
              size={22}
              className="text-[#16697A]/60 cursor-pointer hover:text-[#FFA62B] transition-colors"
            />
            <AiOutlineInstagram
              size={22}
              className="text-[#16697A]/60 cursor-pointer hover:text-[#FFA62B] transition-colors"
            />
            <AiOutlineYoutube
              size={22}
              className="text-[#16697A]/60 cursor-pointer hover:text-[#FFA62B] transition-colors"
            />
          </div>
        </div>

        <div>
          <h4 className="text-[#16697A] font-[700] uppercase tracking-[0.2em] text-[11px] mb-8 font-sans">Company</h4>
          <ul className="flex flex-col gap-4">
            {footerProductLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.link}
                  className="text-[#6B7280] hover:text-[#FFA62B] duration-300 text-[14px] font-[500] tracking-tight font-sans"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[#16697A] font-[700] uppercase tracking-[0.2em] text-[11px] mb-8 font-sans">Shop</h4>
          <ul className="flex flex-col gap-4">
            {footercompanyLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.link}
                  className="text-[#6B7280] hover:text-[#FFA62B] duration-300 text-[14px] font-[500] tracking-tight font-sans"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[#16697A] font-[700] uppercase tracking-[0.2em] text-[11px] mb-8 font-sans">Support</h4>
          <ul className="flex flex-col gap-4">
            {footerSupportLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.link}
                  className="text-[#6B7280] hover:text-[#FFA62B] duration-300 text-[14px] font-[500] tracking-tight font-sans"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center sm:text-left items-center px-12 py-10 border-t border-[#16697A]/10 text-[#6B7280] text-[11px] font-[600] uppercase tracking-[0.1em] font-sans">
        <span>© 2025 TaniaAshraf. All rights reserved.</span>
        <span className="sm:text-center">Terms · Privacy Policy</span>
        <div className="flex justify-center sm:justify-end">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtwZGS06LQiYrucl4l1fkLG6QIPHVMJktWbA&s"
            alt="payment methods"
            className="w-32 opacity-60 hover:opacity-100 transition duration-500 rounded-lg shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
