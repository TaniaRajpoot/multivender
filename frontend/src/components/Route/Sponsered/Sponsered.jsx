import React from "react";

const Sponsered = () => {
  return (
    <div className="px-4 md:px-12 lg:px-20 py-10 bg-[#EDE7E3]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 text-center md:text-left">
          <div className="relative">
            <span className="text-[11px] font-[700] text-[#489FB5] uppercase tracking-[0.4em] mb-3 block font-sans">Partners</span>
            <h2 className="text-2xl md:text-3xl font-[700] text-[#16697A] tracking-tight italic font-display">Trusted by <span className="text-[#489FB5]">Industry Leaders</span></h2>
          </div>
        </div>

        <div className="bg-white/40 border border-[#16697A]/5 rounded-[48px] p-12 md:p-16 lg:p-20 shadow-sm">
          <div className="flex flex-wrap items-center justify-around gap-12 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center justify-center filter hover:scale-110 transition-transform duration-500">
              <img
                src="https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png"
                alt="Sony"
                style={{ width: "120px", objectFit: "contain" }}
              />
            </div>
            <div className="flex items-center justify-center filter hover:scale-110 transition-transform duration-500">
              <img
                src="https://logos-world.net/wp-content/uploads/2020/08/Dell-Logo.png"
                alt="Dell"
                style={{ width: "120px", objectFit: "contain" }}
              />
            </div>
            <div className="flex items-center justify-center filter hover:scale-110 transition-transform duration-500">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/2560px-Lenovo_logo_2015.svg.png"
                alt="Lenovo"
                style={{ width: "120px", objectFit: "contain" }}
              />
            </div>
            <div className="flex items-center justify-center filter hover:scale-110 transition-transform duration-500">
              <img
                src="https://www.vectorlogo.zone/logos/apple/apple-ar21.png"
                alt="Apple"
                style={{ width: "120px", objectFit: "contain" }}
              />
            </div>
            <div className="flex items-center justify-center filter hover:scale-110 transition-transform duration-500">
              <img
                src="https://logos-world.net/wp-content/uploads/2020/04/Samsung-Logo.png"
                alt="Samsung"
                style={{ width: "120px", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsered;
