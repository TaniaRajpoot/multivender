import React, { useState } from "react";
import styles from "../../styles/styles";
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";

const ShopHomePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className={`${styles.section} bg-[#f5f5f5] min-h-screen`}>
      {/* Mobile Tab Toggle */}
      <div className="flex md:hidden w-full border-b bg-white sticky top-0 z-20">
        <button
          onClick={() => setActiveTab("info")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "info"
              ? "border-b-2 border-[#f63b60] text-[#f63b60]"
              : "text-gray-500"
          }`}
        >
          Shop Info
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "profile"
              ? "border-b-2 border-[#f63b60] text-[#f63b60]"
              : "text-gray-500"
          }`}
        >
          Products
        </button>
      </div>

      <div className="w-full flex flex-col md:flex-row py-4 md:py-10 md:justify-between gap-4">
        {/* Sidebar — ShopInfo */}
        <div
          className={`
            w-full md:w-[25%] bg-white rounded-sm shadow-sm
            md:overflow-y-scroll md:h-[90vh] md:sticky md:top-10 md:left-0 md:z-10
            ${activeTab === "info" ? "block" : "hidden"} md:block
          `}
        >
          <ShopInfo isOwner={true} />
        </div>

        {/* Main Content — ShopProfileData */}
        <div
          className={`
            w-full md:w-[72%] rounded-sm bg-white shadow-sm p-4
            ${activeTab === "profile" ? "block" : "hidden"} md:block
          `}
        >
          <ShopProfileData isOwner={true} />
        </div>
      </div>
    </div>
  );
};

export default ShopHomePage;