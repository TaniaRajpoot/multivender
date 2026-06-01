import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SLIDES = [
  {
    title: "Shop the latest deals",
    text: "Find products from trusted sellers. Fast checkout and secure payments.",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1400&auto=format&fit=crop",
    cta: "Browse products",
    link: "/products",
  },
  {
    title: "Tech & gadgets",
    text: "Laptops, phones, and accessories at competitive prices.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop",
    cta: "Shop electronics",
    link: "/products",
  },
  {
    title: "Limited-time events",
    text: "Special offers on selected items. Grab them before they sell out.",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=1400&auto=format&fit=crop",
    cta: "View events",
    link: "/events",
  },
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-medium text-teal-700 mb-2">Welcome to MultiVendor</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {slide.title}
            </h1>
            <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-md">{slide.text}</p>
            <div className="flex flex-wrap gap-3">
              <Link to={slide.link} className="rounded-lg bg-teal-700 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-800 transition">
                {slide.cta}
              </Link>
              <Link to="/sign-up" className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                Create account
              </Link>
            </div>
            <div className="flex gap-2 mt-8">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-teal-700" : "w-2 bg-gray-300"}`}
                />
              ))}
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm aspect-[4/3]">
            <img src={slide.image} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
