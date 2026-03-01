import { useState } from 'react';
import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGES = {
  1: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80",
  2: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&q=80",
  3: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80",
  4: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80",
  5: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80",
  6: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&q=80",
  7: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&q=80",
  8: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80",
  9: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&q=80",
  10: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=80",
};

const CARD_GRADIENTS = {
  1: "from-blue-50 to-blue-100",
  2: "from-pink-50 to-pink-100",
  3: "from-purple-50 to-purple-100",
  4: "from-orange-50 to-orange-100",
  5: "from-red-50 to-red-100",
  6: "from-yellow-50 to-yellow-100",
  7: "from-green-50 to-green-100",
  8: "from-cyan-50 to-cyan-100",
  9: "from-indigo-50 to-indigo-100",
  10: "from-gray-50 to-gray-100",
};

const Categories = () => {
  const navigate = useNavigate();
  const [failedImages, setFailedImages] = useState({});

  const getImageSrc = (item) => {
    if (failedImages[item.id]) return FALLBACK_IMAGES[item.id];
    const raw = item.image_Url || item.images || item.imageUrl || item.image;
    if (typeof raw === "string" && raw.startsWith("http")) return raw;
    if (typeof raw === "object" && raw?.url) return raw.url;
    if (Array.isArray(raw) && raw.length > 0) return raw[0]?.url || raw[0];
    return FALLBACK_IMAGES[item.id] || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=80";
  };

  return (
    <div className="bg-[#EDE7E3] py-10">
      {/* ── Branding Strip ── */}
      <div className={`${styles.section} hidden sm:block mb-12`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {brandingData &&
            brandingData.map((i, index) => (
              <div
                key={i.id || index}
                className="group flex items-center gap-5 p-2 transition-all duration-300"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full border border-[#16697A]/10 text-[#16697A] group-hover:bg-[#16697A] group-hover:text-white transition-all shadow-sm">
                  {i.icon}
                </div>
                <div>
                  <h3 className="font-[700] text-[#16697A] text-[12px] uppercase tracking-[0.1em] font-sans">{i.title}</h3>
                  <p className="text-[#489FB5] text-[10px] uppercase font-sans mt-0.5 opacity-60">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ── Categories Section ── */}
      <div id="categories" className={`${styles.section}`}>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-6">
          <div className="relative">
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#FFA62B] rounded-full" />
            <span className="text-[11px] font-[700] text-[#489FB5] uppercase tracking-[0.4em] mb-2 block font-sans">Categories</span>
            <h2 className="text-2xl md:text-3xl font-[700] text-[#16697A] tracking-tight italic font-display">Shop by <span className="text-[#FFA62B]">Category</span></h2>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="group flex items-center gap-3 text-[11px] font-[700] text-[#16697A] uppercase tracking-[0.2em] font-sans hover:text-[#FFA62B] transition-colors"
          >
            View all
            <div className="w-8 h-[1px] bg-[#16697A] group-hover:w-12 group-hover:bg-[#FFA62B] transition-all" />
          </button>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-[#16697A]/5 border border-[#16697A]/5 rounded-[32px] overflow-hidden">
          {categoriesData &&
            categoriesData.map((item) => {
              const id = item.id;
              const title = item.title || item.name;
              const imgSrc = getImageSrc(item);

              return (
                <div
                  key={id}
                  onClick={() => navigate(`/products?category=${title}`)}
                  className="group relative cursor-pointer bg-white p-8 hover:bg-[#EDE7E3]/30 transition-all duration-500 overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="w-10 h-[1px] bg-[#FFA62B] mb-6 group-hover:w-16 transition-all" />
                    <h5 className="text-[13px] font-[700] text-[#16697A] uppercase tracking-[0.1em] font-sans group-hover:text-[#FFA62B] transition-colors leading-tight mb-2">
                      {title}
                    </h5>
                    <p className="text-[9px] font-[700] text-[#489FB5] uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">Shop now →</p>
                  </div>

                  <img
                    src={imgSrc}
                    alt={title}
                    className="absolute -right-4 -bottom-4 h-28 w-28 object-contain opacity-10 group-hover:opacity-100 group-hover:-translate-y-4 group-hover:-translate-x-4 transition-all duration-700 pointer-events-none grayscale group-hover:grayscale-0"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [id]: true }))
                    }
                  />

                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#16697A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Categories;