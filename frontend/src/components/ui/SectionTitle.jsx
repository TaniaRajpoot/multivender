import React from "react";

const SectionTitle = ({ title, subtitle, center = true }) => (
  <div className={center ? "text-center mb-8" : "mb-6"}>
    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">{title}</h2>
    {subtitle && <p className="text-gray-600 mt-2 text-sm max-w-xl mx-auto">{subtitle}</p>}
  </div>
);

export default SectionTitle;
