import React, { useState } from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import { RxPlus, RxMinus } from "react-icons/rx";

const FAQPage = () => {
  return (
    <div className="bg-[#EDE7E3] min-h-screen">
      <Header activeHeading={5} />
      <Faq />
      <Footer />
    </div>
  );
};

const Faq = () => {
  const [activeTab, setActiveTab] = useState(0);

  const toggleTab = (tab) => {
    if (activeTab === tab) {
      setActiveTab(0);
    } else {
      setActiveTab(tab);
    }
  };

  const faqData = [
    {
      id: 2,
      question: "What is your return policy?",
      answer: "If you're not satisfied with your purchase, we accept returns within 30 days of delivery. To initiate a return, please email us at support@crownmarket.com with your order number and a brief explanation."
    },
    {
      id: 3,
      question: "How do I track my order?",
      answer: "You can track your order by clicking the tracking link in your shipping confirmation email, or by logging into your account on our website and viewing the order details."
    },
    {
      id: 4,
      question: "How do I contact customer support?",
      answer: "You can contact our customer support team by emailing us at support@crownmarket.com, or by calling our hotline at (555) 789-0123 between 9am and 5pm EST."
    },
    {
      id: 5,
      question: "Can I change or cancel my order?",
      answer: "Once an order has been placed, we are not able to make changes or cancellations immediately. Please contact support within 1 hour for urgent requests."
    },
    {
      id: 6,
      question: "Do you offer international shipping?",
      answer: "Currently, we only offer shipping within the primary market zones. We are expanding our global logistics network as we speak."
    },
    {
      id: 7,
      question: "What payment methods do you accept?",
      answer: "We accept Visa, Mastercard, PayPal, and also offer a secure Cash on Delivery system for your convenience."
    }
  ];

  return (
    <div className="max-w-[1000px] mx-auto py-10 px-4 md:px-8">
      <div className="text-center mb-8 animate-in slide-in-from-top duration-700">
        <h2 className="text-2xl md:text-3xl font-[700] text-[#16697A] tracking-tight mb-4 font-display italic">FAQ</h2>
        <div className="w-24 h-1.5 bg-[#FFA62B] mx-auto rounded-full" />
      </div>

      <div className="space-y-6">
        {faqData.map((item) => (
          <div key={item.id} className="group">
            <div className={`
                bg-white/70 backdrop-blur-xl rounded-[32px] overflow-hidden border border-white transition-all duration-500
                ${activeTab === item.id ? "shadow-2xl translate-y-[-4px]" : "hover:shadow-soft hover:translate-y-[-2px]"}
            `}>
              <button
                className="flex items-center justify-between w-full h-24 px-8 text-left"
                onClick={() => toggleTab(item.id)}
              >
                <span className={`text-xl font-[600] tracking-tight transition-colors duration-300 font-sans ${activeTab === item.id ? "text-[#16697A]" : "text-[#16697A]/70 group-hover:text-[#16697A]"}`}>
                  {item.question}
                </span>
                <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                    ${activeTab === item.id ? "bg-[#FFA62B] text-white rotate-180" : "bg-[#EDE7E3] text-[#16697A]"}
                `}>
                  {activeTab === item.id ? <RxMinus size={24} /> : <RxPlus size={24} />}
                </div>
              </button>

              <div className={`
                  px-8 transition-all duration-500 ease-in-out
                  ${activeTab === item.id ? "max-h-60 pb-8 opacity-100" : "max-h-0 opacity-0"}
              `}>
                <div className="pt-4 border-t border-[#16697A]/5">
                  <p className="text-lg font-medium text-[#489FB5] leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-8 bg-[#16697A] rounded-[48px] text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <h3 className="text-xl font-[700] text-[#EDE7E3] tracking-tight mb-4 relative z-10 font-display italic">Contact Us</h3>
        <button className="bg-[#FFA62B] text-[#EDE7E3] font-[700] px-12 py-5 rounded-2xl hover:bg-white hover:text-[#16697A] transition-all transform hover:scale-105 shadow-xl relative z-10 uppercase tracking-widest text-sm font-sans">
          Submit
        </button>
      </div>
    </div>
  );
};

export default FAQPage;