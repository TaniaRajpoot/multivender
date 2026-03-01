import React from "react";

const CheckoutSteps = ({ active }) => {
  const steps = [
    { id: 1, label: "Shipping" },
    { id: 2, label: "Payment" },
    { id: 3, label: "Success" },
  ];

  return (
    <div className="w-full flex justify-center py-16">
      <div className="w-[90%] md:w-[60%] flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-px bg-[#16697A]/10 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-px bg-[#16697A] -translate-y-1/2 z-0 transition-all duration-700 ease-in-out"
          style={{ width: active === 1 ? "0%" : active === 2 ? "50%" : "100%" }}
        />

        {steps.map((step) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center">
            <div className={`
              w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-[700] text-sm md:text-base tracking-widest transition-all duration-700 shadow-xl
              ${active >= step.id
                ? "bg-[#16697A] text-[#EDE7E3] scale-110 shadow-teal-900/20"
                : "bg-white text-[#16697A]/20 border border-[#16697A]/5"
              }
            `}>
              0{step.id}
            </div>
            <span className={`
              absolute -bottom-10 whitespace-nowrap text-[10px] md:text-[11px] font-[700] uppercase tracking-[0.3em] font-sans transition-colors duration-500
              ${active >= step.id ? "text-[#16697A]" : "text-[#16697A]/20"}
            `}>
              {step.label}
            </span>

            {active === step.id && (
              <div className="absolute -inset-4 bg-[#FFA62B]/10 blur-2xl rounded-full animate-pulse z-[-1]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;