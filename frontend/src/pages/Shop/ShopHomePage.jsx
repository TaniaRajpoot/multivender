import React, { useState } from "react";
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";
import { ui } from "../../styles/theme";

const ShopHomePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className={`${ui.page} py-6`}>
      <div className={ui.containerWide}>
        {/* Mobile Tab Toggle */}
        <div className="flex md:hidden w-full border-b border-gray-200 bg-white sticky top-0 z-20 mb-4 rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === "info"
                ? "border-b-2 border-teal-700 text-teal-700 bg-teal-50/30"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Shop Info
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === "profile"
                ? "border-b-2 border-teal-700 text-teal-700 bg-teal-50/30"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Products
          </button>
        </div>

        <div className="w-full flex flex-col md:flex-row py-4 md:justify-between gap-6">
          {/* Sidebar — ShopInfo */}
          <div
            className={`
              w-full md:w-[28%]
              ${activeTab === "info" ? "block" : "hidden"} md:block
            `}
          >
            <ShopInfo isOwner={true} />
          </div>

          {/* Main Content — ShopProfileData */}
          <div
            className={`
              w-full md:w-[70%] rounded-xl bg-white border border-gray-200 shadow-sm p-4 sm:p-6
              ${activeTab === "profile" ? "block" : "hidden"} md:block
            `}
          >
            <ShopProfileData isOwner={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHomePage;