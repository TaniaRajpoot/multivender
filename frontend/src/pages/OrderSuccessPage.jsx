import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Lottie from "react-lottie";
import animationData from "../assets/payment-success";
import { Link } from "react-router-dom";

const OrderSuccessPage = () => {
  return (
    <div className="bg-[#EDE7E3] min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <Success />
      </div>
      <Footer />
    </div>
  );
};

const Success = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="w-full max-w-2xl bg-white/70 backdrop-blur-2xl rounded-[60px] p-12 md:p-20 border border-white shadow-soft relative overflow-hidden text-center">
      <div className="relative z-10">
        <div className="bg-[#EDE7E3]/50 rounded-[48px] p-8 inline-block mb-10 shadow-inner">
          <Lottie options={defaultOptions} width={150} height={150} />
        </div>

        <h2 className="text-4xl md:text-5xl font-[700] text-[#16697A] tracking-tighter mb-6 font-display italic">
          Your order is successful
        </h2>

        <p className="text-[#6B7280] text-lg font-[500] leading-relaxed max-w-md mx-auto mb-12 font-sans">
          Thank you for your purchase. We are processing your order and will notify you soon.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/" className="w-full sm:w-auto h-16 px-10 flex items-center justify-center bg-[#16697A] text-[#EDE7E3] font-[700] uppercase tracking-widest text-[13px] rounded-2xl hover:bg-[#FFA62B] transition-all duration-500 shadow-xl font-sans">
            Back to Home
          </Link>
          <Link to="/profile" className="w-full sm:w-auto h-16 px-10 flex items-center justify-center bg-white text-[#16697A] font-[700] uppercase tracking-widest text-[13px] rounded-2xl border border-[#16697A]/10 hover:bg-[#EDE7E3] transition-all font-sans">
            Track Order
          </Link>
        </div>

        <div className="mt-16 pt-10 border-t border-[#16697A]/10">
          <p className="text-[10px] font-[700] text-[#9CA3AF] uppercase tracking-[0.3em] font-sans">
            Confirmation sent to your email
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;