import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const C = {
  teal: "#16697A",   // primary — navbar, headlines, accents
  mid: "#489FB5",   // secondary — buttons, borders
  sky: "#82C0CC",   // hover, highlights, subtle tints
  cream: "#EDE7E3",   // main background
  orange: "#FFA62B",   // CTA, badges, active states
  white: "#FFFFFF",
  dark: "#0D3D47",   // deep text
};

const SLIDES = [
  {
    id: 0,
    category: "Fashion",
    headline: ["Dressed for", "Every Moment."],
    sub: "Curated looks from the world's finest labels — delivered to your door.",
    bg: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1400&auto=format&fit=crop",
    tag: "New Season",
    stat: "2,400+ styles",
  },
  {
    id: 1,
    category: "Electronics",
    headline: ["Tomorrow's Tech,", "Today."],
    sub: "Premium devices and gadgets from leading brands, all in one marketplace.",
    bg: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop",
    tag: "Just Arrived",
    stat: "5,000+ devices",
  },
  {
    id: 2,
    category: "Home & Living",
    headline: ["Spaces That", "Inspire You."],
    sub: "Transform every room with handpicked décor and luxury home essentials.",
    bg: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1400&auto=format&fit=crop",
    tag: "Editor's Pick",
    stat: "3,100+ pieces",
  },
  {
    id: 3,
    category: "Beauty",
    headline: ["Rituals Worth", "Indulging."],
    sub: "Prestige skincare, fragrances and wellness from global beauty houses.",
    bg: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=1400&auto=format&fit=crop",
    tag: "Best Sellers",
    stat: "1,800+ products",
  },
];

const useCounter = (target, duration = 1400) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const end = parseInt(String(target).replace(/\D/g, ""));
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
};

const Counter = ({ value, label }) => {
  const num = useCounter(value);
  const suffix = String(value).replace(/[\d,]/g, "");
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span style={{
        color: C.teal,
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: "30px", fontWeight: "700", letterSpacing: "-0.01em",
      }}>
        {num.toLocaleString()}{suffix}
      </span>
      <span style={{
        color: C.mid, fontSize: "10px", letterSpacing: "0.18em",
        textTransform: "uppercase", marginTop: "4px",
      }}>
        {label}
      </span>
    </div>
  );
};

const FloatingCard = ({ emoji, label, value, delay, x, y }) => (
  <div style={{
    position: "absolute", left: x, top: y,
    display: "flex", alignItems: "center", gap: "12px",
    padding: "12px 16px",
    backgroundColor: C.white,
    border: `1.5px solid ${C.sky}`,
    boxShadow: `0 4px 24px rgba(22,105,122,0.14), 0 1px 4px rgba(0,0,0,0.05)`,
    minWidth: "162px",
    borderRadius: "8px",
    animation: `floatCard 4s ease-in-out ${delay}s infinite`,
  }}>
    <span style={{ fontSize: "22px" }}>{emoji}</span>
    <div>
      <p style={{ color: C.mid, fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase" }}>{label}</p>
      <p style={{ color: C.teal, fontSize: "13px", fontWeight: "600", fontFamily: "'Cormorant Garamond', Georgia, serif", marginTop: "2px" }}>{value}</p>
    </div>
  </div>
);

const Hero = () => {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const timerRef = useRef(null);
  const keyRef = useRef(0);

  const goTo = useCallback((idx) => {
    if (animating || idx === active) return;
    setActive(idx);
    setAnimating(true);
    keyRef.current += 1;
    setTimeout(() => setAnimating(false), 700);
  }, [active, animating]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((a) => { keyRef.current += 1; return (a + 1) % SLIDES.length; });
    }, 5500);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleMouseMove = (e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  const slide = SLIDES[active];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes floatCard {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes heroTagIn {
          from { opacity:0; transform:translateX(-24px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes heroH1In {
          from { opacity:0; transform:translateX(-32px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes heroSubIn {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes heroFadeIn {
          from { opacity:0; } to { opacity:1; }
        }
        @keyframes bgScale {
          from { opacity:0; transform:scale(1.06); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes progressRun {
          from { width:0%; } to { width:100%; }
        }
        @keyframes wavePulse {
          0%,100% { transform: scaleX(1) scaleY(1); }
          50%      { transform: scaleX(1.02) scaleY(1.04); }
        }

        .cm-bg-active { animation: bgScale 0.8s ease both; }
        .cm-tag  { animation: heroTagIn  0.55s 0.05s ease both; }
        .cm-h1a  { animation: heroH1In   0.55s 0.10s ease both; }
        .cm-h1b  { animation: heroH1In   0.55s 0.20s ease both; }
        .cm-sub  { animation: heroSubIn  0.5s  0.28s ease both; }
        .cm-ctas { animation: heroSubIn  0.5s  0.38s ease both; }
        .cm-stats{ animation: heroFadeIn 0.6s  0.48s ease both; }
        .cm-progress { animation: progressRun 5.5s linear both; }

        .cm-btn-primary {
          background-color: #FFA62B;
          color: #fff;
          padding: 14px 36px;
          font-size: 13px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 700;
          border: none;
          cursor: pointer;
          border-radius: 8px;
          box-shadow: 0 6px 24px rgba(255,166,43,0.38);
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .cm-btn-primary:hover {
          background-color: #e8941f;
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 10px 32px rgba(255,166,43,0.45);
        }
        .cm-btn-secondary {
          background-color: transparent;
          color: #16697A;
          padding: 14px 36px;
          font-size: 13px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 600;
          border: 2px solid #489FB5;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .cm-btn-secondary:hover {
          background-color: #489FB5;
          color: #fff;
          transform: translateY(-2px);
        }
        .cm-tab-btn:hover { background: rgba(130,192,204,0.15) !important; }
      `}</style>

      <div
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative w-full min-h-[60vh] md:min-h-[70vh] flex flex-col md:flex-row overflow-hidden bg-[#EDE7E3] font-sans"
      >
        {/* ── Split layout ── */}
        <div className="flex flex-col md:flex-row w-full min-h-full relative z-[1]">

          {/* ── LEFT: Content panel ── */}
          <div className="w-full md:w-[52%] flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 relative z-[2] bg-[#EDE7E3]">

            {/* Teal dot-grid pattern */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 0, opacity: 0.18,
              backgroundImage: `radial-gradient(circle, #16697A 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
              pointerEvents: "none",
            }} />

            {/* Teal left accent bar */}
            <div style={{
              position: "absolute", left: 0, top: "12%", bottom: "12%",
              width: "4px", borderRadius: "0 4px 4px 0",
              background: `linear-gradient(to bottom, transparent, #16697A 25%, #489FB5 75%, transparent)`,
            }} />

            {/* Orange top-right blob */}
            <div style={{
              position: "absolute", top: "-60px", right: "-40px",
              width: "220px", height: "220px", borderRadius: "50%",
              backgroundColor: "rgba(255,166,43,0.08)",
              pointerEvents: "none",
            }} />

            <div key={keyRef.current} style={{ position: "relative", zIndex: 1 }}>

              {/* Tag */}
              <div className="cm-tag" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <span style={{
                  color: C.white,
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: "700",
                  padding: "5px 14px",
                  backgroundColor: C.orange,
                  borderRadius: "20px",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  ✦ {slide.tag}
                </span>
              </div>

              {/* Headline */}
              <h1
                className="cm-h1a"
                style={{
                  color: C.dark,
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: "700",
                  lineHeight: "1.08",
                  letterSpacing: "-0.01em",
                  margin: "0 0 4px 0",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
              >
                {slide.headline[0]}
              </h1>
              <h1
                className="cm-h1b"
                style={{
                  color: C.teal,
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: "600",
                  lineHeight: "1.08",
                  letterSpacing: "-0.01em",
                  fontStyle: "italic",
                  margin: "0 0 26px 0",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
              >
                {slide.headline[1]}
              </h1>

              {/* Teal-to-sky gradient rule */}
              <div style={{
                height: "3px",
                width: "72px",
                background: `linear-gradient(to right, ${C.teal}, ${C.sky})`,
                borderRadius: "2px",
                marginBottom: "22px",
              }} />

              {/* Sub */}
              <p
                className="cm-sub"
                style={{
                  color: "#4a5568",
                  fontSize: "clamp(14px, 1.1vw, 16px)",
                  lineHeight: "1.8",
                  fontWeight: "400",
                  marginBottom: "36px",
                  maxWidth: "420px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {slide.sub}
              </p>

              {/* CTAs */}
              <div className="cm-ctas" style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginBottom: "44px" }}>
                <Link to="/products">
                  <button className="cm-btn-primary">Shop Now</button>
                </Link>
                {/* Reverting to whatever was original if possible, otherwise keeping it clean */}
              </div>

              {/* Stats */}
              <div
                className="cm-stats"
                style={{
                  display: "flex",
                  gap: "36px",
                  paddingTop: "22px",
                  borderTop: `2px solid rgba(130,192,204,0.3)`,
                }}
              >
                <Counter value={50000} label="Buyers" />
                <Counter value={500} label="Vendors" />
                <Counter value={10000} label="Products" />
              </div>
            </div>
          </div>

          {/* ── RIGHT: Image panel ── */}
          <div className="hidden md:block md:w-[48%] relative overflow-hidden h-full">

            {/* Slide backgrounds */}
            {
              SLIDES.map((s, i) => (
                <div
                  key={s.id}
                  className={i === active ? "cm-bg-active" : ""}
                  style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `url(${s.bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: i === active ? 1 : 0,
                    transform: `translate(${mousePos.x * -14}px, ${mousePos.y * -10}px) scale(1.06)`,
                    transition: "opacity 0.7s ease, transform 0.15s ease-out",
                  }}
                />
              ))
            }

            {/* Soft teal gradient over image — left edge blends into cream */}
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(to right, rgba(237,231,227,0.65) 0%, rgba(22,105,122,0.08) 35%, transparent 70%)`,
            }} />

            {/* Teal vignette bottom */}
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(to top, rgba(22,105,122,0.4) 0%, transparent 50%)`,
            }} />

            {/* Floating cards */}
            <FloatingCard emoji="🛍️" label="Orders Today" value="1,240 placed" delay={0} x="8%" y="14%" />
            <FloatingCard emoji="⭐" label="Avg. Rating" value="4.9 / 5.0" delay={1.2} x="12%" y="52%" />
            <FloatingCard emoji="🚚" label="Free Shipping" value="Orders $99+" delay={0.6} x="6%" y="74%" />

            {/* Vertical slide dots */}
            <div style={{
              position: "absolute", top: "50%", right: "18px",
              transform: "translateY(-50%)",
              display: "flex", flexDirection: "column", gap: "8px",
            }}>
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => { clearInterval(timerRef.current); goTo(idx); }}
                  style={{
                    width: "4px",
                    height: idx === active ? "28px" : "10px",
                    backgroundColor: idx === active ? C.orange : "rgba(255,255,255,0.5)",
                    border: "none", borderRadius: "3px", cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: 0,
                    boxShadow: idx === active ? `0 0 8px rgba(255,166,43,0.6)` : "none",
                  }}
                />
              ))}
            </div>

            {/* Category label on image */}
            <div style={{
              position: "absolute",
              bottom: "72px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span style={{
                color: C.white,
                fontSize: "13px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontWeight: "600",
                fontFamily: "'DM Sans', sans-serif",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}>
                {slide.category}
              </span>
              <span style={{
                backgroundColor: C.orange,
                color: C.white,
                fontSize: "10px",
                fontWeight: "700",
                padding: "3px 8px",
                borderRadius: "12px",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {slide.stat}
              </span>
            </div>
          </div>
        </div>

        {/* ── Orange progress bar ── */}
        <div
          key={`progress-${active}`}
          className="cm-progress"
          style={{
            position: "absolute",
            bottom: "48px", left: 0,
            height: "2px",
            backgroundColor: C.orange,
            boxShadow: `0 0 8px rgba(255,166,43,0.5)`,
            zIndex: 5,
          }}
        />

        {/* ── Category Tabs ── */}
        <div style={{
          position: "absolute",
          bottom: "48px", left: 0,
          height: "2px",
          backgroundColor: C.orange,
          boxShadow: `0 0 8px rgba(255,166,43,0.5)`,
          zIndex: 5,
        }}
        />

        {/* ── Category Tabs ── */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          display: "flex",
          backgroundColor: C.white,
          borderTop: `1px solid rgba(130,192,204,0.2)`,
          boxShadow: "0 -2px 10px rgba(22,105,122,0.05)",
          zIndex: 5,
        }}>
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              className="cm-tab-btn"
              onClick={() => { clearInterval(timerRef.current); goTo(idx); }}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 4px",
                backgroundColor: idx === active ? "rgba(22,105,122,0.04)" : "transparent",
                border: "none",
                borderRight: idx < SLIDES.length - 1 ? `1px solid rgba(130,192,204,0.15)` : "none",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.2s",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {idx === active && (
                <span style={{
                  position: "absolute",
                  top: 0, left: "50%",
                  transform: "translateX(-50%)",
                  width: "24px", height: "2px",
                  backgroundColor: C.orange,
                  borderRadius: "0 0 2px 2px",
                }} />
              )}
              <span style={{
                color: idx === active ? C.teal : "#6b7280",
                fontSize: "9px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: idx === active ? "700" : "500",
                transition: "color 0.2s",
              }}>
                {s.category}
              </span>
            </button>
          ))}
        </div>

        {/* ── Scroll indicator ── */}
        <div style={{
          position: "absolute", right: "24px", bottom: "72px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
          zIndex: 5,
        }}>
          <span style={{
            color: C.mid, fontSize: "9px", letterSpacing: "0.2em",
            textTransform: "uppercase", writingMode: "vertical-rl",
            fontFamily: "'DM Sans', sans-serif",
          }}>Scroll</span>
          <div style={{
            width: "1px", height: "40px",
            background: `linear-gradient(to bottom, ${C.mid}, transparent)`,
          }} />
        </div>
      </div >
    </>
  );
};

export default Hero;
