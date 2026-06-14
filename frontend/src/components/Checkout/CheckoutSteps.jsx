import React from "react";

const steps = ["Cart", "Shipping", "Payment"];

const CheckoutSteps = ({ active }) => (
  <div className="bg-white border-b border-gray-200">
    <div className="max-w-3xl mx-auto px-4 py-4 flex justify-center gap-2 sm:gap-8">
      {steps.map((label, i) => {
        const step = i + 1;
        const done = active > step;
        const current = active === step;
        return (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                current ? "bg-teal-700 text-white" : done ? "bg-teal-100 text-teal-800" : "bg-gray-200 text-gray-500"
              }`}
            >
              {step}
            </span>
            <span className={`text-sm hidden sm:inline ${current ? "font-semibold text-gray-900" : "text-gray-500"}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

export default CheckoutSteps;
