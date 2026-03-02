import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const C = {
  teal: "#16697A",
  mid: "#489FB5",
  sky: "#82C0CC",
  cream: "#EDE7E3",
  orange: "#FFA62B",
  white: "#FFFFFF",
  dark: "#0D3D47",
};

const SLIDES = [
  {
    id: 0,
    category: "Cloths",
    headline: ["Modern", "Collective"],
    sub: "Discover the latest trends in high-end fashion, curated specifically for the discerning eye. Quality meets contemporary design.",
    bg: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1400&auto=format&fit=crop",
    tag: "New Season",
    stat: "2,400+ styles",
    accent: "#489FB5",
  },
  {
    id: 1,
    category: "Computers and Laptops",
    headline: ["Futuristic", "Gadgets"],
    sub: "Precision-engineered electronics and smart devices that redefine your digital lifestyle. Experience the future today.",
    bg: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop",
    tag: "Just Arrived",
    stat: "5,000+ devices",
    accent: "#16697A",
  },
  {
    id: 2,
    category: "Accesories",
    headline: ["Elegant", "Spaces"],
    sub: "Transform your living environment with minimalist decor and artisanal furniture. Where comfort meets sophisticated style.",
    bg: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1400&auto=format&fit=crop",
    tag: "Editor's Pick",
    stat: "3,100+ pieces",
    accent: "#82C0CC",
  },
  {
    id: 3,
    category: "cosmetics and body care",
    headline: ["Natural", "Radiance"],
    sub: "Curated skincare and cosmetics formulated with premium ingredients. Unlock your natural glow with our expert selection.",
    bg: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=1400&auto=format&fit=crop",
    tag: "Best Sellers",
    stat: "1,800+ products",
    accent: "#FFA62B",
  },
];

const STATS = [
  { value: 50000, label: "Buyers" },
  { value: 500, label: "Vendors" },
  { value: 10000, label: "Products" },
];

// Animated counter
const useCounter = (target, duration = 1600) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const end = parseInt(String(target).replace(/\D/g, ""));
    const raf = requestAnimationFrame(function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * end));
      if (p < 1) requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
};

const Stat = ({ value, label }) => {
  const num = useCounter(value);
  const suffix = String(value).replace(/[\d,]/g, "");
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        color: C.teal,
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: "28px", fontWeight: "700",
        lineHeight: 1,
        letterSpacing: "-0.01em",
      }}>
        {num.toLocaleString()}{suffix}
        <span style={{ fontSize: "16px", marginLeft: "1px" }}>+</span>
      </div>
      <div style={{
        color: C.mid, fontSize: "9.5px",
        letterSpacing: "0.18em", textTransform: "uppercase",
        marginTop: "5px", fontFamily: "'DM Sans', sans-serif",
        fontWeight: 600,
      }}>
        {label}
      </div>
    </div>
  );
};

const FloatingCard = ({ emoji, label, value, delay, style }) => (
  <div style={{
    position: "absolute",
    display: "flex", alignItems: "center", gap: "10px",
    padding: "10px 14px",
    backgroundColor: "rgba(255,255,255,0.94)",
    backdropFilter: "blur(8px)",
    border: `1px solid rgba(130,192,204,0.35)`,
    boxShadow: "0 4px 20px rgba(22,105,122,0.12), 0 1px 3px rgba(0,0,0,0.04)",
    borderRadius: "10px",
    animation: `heroFloat 4s ease-in-out ${delay}s infinite`,
    ...style,
  }}>
    <span style={{ fontSize: "20px", lineHeight: 1 }}>{emoji}</span>
    <div>
      <div style={{ color: C.mid, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{label}</div>
      <div style={{ color: C.teal, fontSize: "12.5px", fontWeight: "600", fontFamily: "'Cormorant Garamond', Georgia, serif", marginTop: "1px" }}>{value}</div>
    </div>
  </div>
);

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-[500px] md:min-h-[600px] w-full bg-[#EDE7E3] overflow-hidden flex items-center">
      {/* Background Gradient - Premium Teal Radial */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-[#16697A]/5 to-transparent pointer-events-none" />
      <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-[#16697A]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 w-full relative flex flex-col md:flex-row items-center justify-between gap-12 py-12 md:py-0">
        
        {/* Left Content: Narrative & Discovery */}
        <div className="w-full md:w-[50%] space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#16697A]/10 text-[#16697A] rounded-full">
            <span className="animate-pulse">✨</span>
            <span className="text-xs font-bold uppercase tracking-widest">{SLIDES[currentSlide].category} Discovery</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#0D3D47] leading-[1.1] tracking-tight">
              {SLIDES[currentSlide].headline[0]} <span className="text-[#FFA62B]">{SLIDES[currentSlide].headline[1]}</span>
            </h1>
            <p className="text-base md:text-lg text-[#489FB5] font-medium leading-relaxed max-w-[500px]">
              {SLIDES[currentSlide].sub}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <Link to="/products">
              <button className="h-14 px-10 bg-[#16697A] text-white font-bold rounded-2xl hover:bg-[#0D3D47] transition-all transform hover:scale-[1.05] shadow-xl shadow-[#16697A]/20 uppercase tracking-widest text-xs">
                Explore Now
              </button>
            </Link>
          </div>
        </div>

        {/* Right Content: The Sliding Image Container */}
        <div className="w-full md:w-[45%] relative group">
          {/* Main Container with "Sliding" Effect Shadow */}
          <div className="relative rounded-[40px] overflow-hidden border-8 border-white shadow-2xl shadow-[#0D3D47]/10 aspect-square md:aspect-auto md:h-[450px]">
             {SLIDES.map((slide, index) => (
               <img
                 key={index}
                 src={slide.bg}
                 alt={slide.category}
                 className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out transform ${
                    index === currentSlide ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-full scale-110"
                 }`}
               />
             ))}
             
             {/* Featured Badge */}
             <div className="absolute top-6 right-6 px-5 py-2 bg-[#FFA62B] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                Featured
             </div>

             {/* Slide Progress Overlays */}
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                {SLIDES.map((_, i) => (
                  <div 
                    key={i} 
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${i === currentSlide ? "w-8 bg-[#16697A]" : "w-3 bg-white/50"}`} 
                  />
                ))}
             </div>
          </div>

          {/* Decorative Floating Element */}
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#16697A]/5 rounded-3xl -z-10 animate-bounce transition-all duration-[3000ms]" />
          <div className="absolute -top-6 -right-6 w-24 h-24 border-4 border-[#FFA62B]/20 rounded-full -z-10 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
