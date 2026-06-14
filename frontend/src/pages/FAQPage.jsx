import React, { useState } from "react";
import StoreLayout from "../components/ui/StoreLayout";
import { RxPlus, RxMinus } from "react-icons/rx";
import { ui } from "../styles/theme";

const faqData = [
  { id: 1, question: "What is your return policy?", answer: "Returns are accepted within 30 days. Contact support with your order number." },
  { id: 2, question: "How do I track my order?", answer: "Go to Profile → Track order, or use the link in your shipping email." },
  { id: 3, question: "How do I contact support?", answer: "Email support@shop.com or use the contact form in Help." },
  { id: 4, question: "Can I change or cancel my order?", answer: "Contact us within 24 hours of placing the order if it has not shipped yet." },
];

const FAQPage = () => (
  <StoreLayout activeHeading={5}>
    <div className={`${ui.container} ${ui.section}`}>
      <h1 className={ui.title}>Help & FAQ</h1>
      <p className={`${ui.subtitle} mb-8`}>Quick answers to common questions.</p>
      <FaqAccordion />
    </div>
  </StoreLayout>
);

const FaqAccordion = () => {
  const [activeTab, setActiveTab] = useState(0);
  const toggle = (id) => setActiveTab(activeTab === id ? 0 : id);

  return (
    <div className="space-y-3 max-w-2xl">
      {faqData.map((item) => (
        <div key={item.id} className={ui.card}>
          <button type="button" onClick={() => toggle(item.id)} className="w-full flex items-center justify-between p-4 text-left">
            <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
            {activeTab === item.id ? <RxMinus className="shrink-0" /> : <RxPlus className="shrink-0" />}
          </button>
          {activeTab === item.id && (
            <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQPage;
