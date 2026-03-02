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

// Soft accent colors per category id
const CATEGORY_COLORS = {
  1: "bg-blue-50",
  2: "bg-pink-50",
  3: "bg-purple-50",
  4: "bg-orange-50",
  5: "bg-red-50",
  6: "bg-yellow-50",
  7: "bg-green-50",
  8: "bg-cyan-50",
  9: "bg-indigo-50",
  10: "bg-gray-50",
};

const Categories = () => {
  const navigate = useNavigate();
  const [failedImages, setFailedImages] = useState({});

  const getImageSrc = (item) => {
    if (failedImages[item.id]) return FALLBACK_IMAGES[item.id];
    return item.image_Url || FALLBACK_IMAGES[item.id];
  };

  return (
    <div className="bg-[#EDE7E3] py-12">
      {/* ── Branding Strip ── */}
      <div className={`${styles.section} hidden sm:block mb-16`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {brandingData &&
            brandingData.map((i, index) => (
              <div
                key={i.id || index}
                className="group flex items-center gap-5 transition-all duration-300"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-white rounded-2xl border border-[#16697A]/10 text-[#16697A] group-hover:bg-[#16697A] group-hover:text-white transition-all shadow-sm">
                  {i.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[#16697A] text-[13px] uppercase tracking-widest">{i.title}</h3>
                  <p className="text-[#489FB5] text-[10px] uppercase font-medium mt-0.5">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ── Categories Section ── */}
      <div id="categories" className={`${styles.section}`}>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-1 bg-[#FFA62B] rounded-full" />
              <span className="text-[11px] font-black text-[#489FB5] uppercase tracking-[0.4em]">Collection</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#16697A] tracking-tight">Shop by <span className="text-[#FFA62B]">Category</span></h2>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="group flex items-center gap-3 text-[11px] font-black text-[#16697A] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
          >
            View all
            <div className="w-8 h-[2px] bg-[#16697A] group-hover:w-16 transition-all" />
          </button>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categoriesData &&
            categoriesData.map((item, index) => {
              const id = item.id;
              const title = item.title || item.name;
              const imgSrc = getImageSrc(item);
              const colorClass = CATEGORY_COLORS[id] || "bg-[#EDE7E3]";

              return (
                <div
                  key={index}
                  onClick={() => navigate(`/products?category=${title}`)}
                  className="group relative cursor-pointer"
                >
                  {/* Card Container - Glassmorphism style matching DropDown */}
                  <div className={`
                    relative h-48 rounded-[32px] overflow-hidden transition-all duration-500 transform 
                    group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-[#16697A]/10
                    border border-white bg-white/60 backdrop-blur-md
                  `}>
                    {/* Background Accent */}
                    <div className={`absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20 ${colorClass}`} />

                    {/* Stylized Image Clipping - Large & Faded like DropDown */}
                    <img
                      src={imgSrc}
                      alt={title}
                      className="absolute right-[-10%] bottom-[-10%] w-36 h-36 object-contain transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-6 drop-shadow-2xl grayscale group-hover:grayscale-0 opacity-30 group-hover:opacity-100"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [id]: true }))
                      }
                    />

                    {/* Content Layer */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      {/* Icon Box */}
                      <div className={`w-11 h-11 rounded-2xl ${colorClass.replace('bg-', 'bg-opacity-30 bg-')} flex items-center justify-center backdrop-blur-md border border-white/40 shadow-sm transition-transform group-hover:rotate-12`}>
                        <div className="w-1.5 h-1.5 bg-[#16697A] rounded-full group-hover:scale-150 transition-transform" />
                      </div>

                      {/* Label & Hint */}
                      <div>
                        <h4 className="text-[14px] font-black text-[#16697A] leading-tight uppercase tracking-tight group-hover:text-[#FFA62B] transition-colors font-sans">
                          {title}
                        </h4>
                        <p className="text-[9px] font-black text-[#82C0CC] uppercase tracking-widest mt-1 opacity-60 group-hover:opacity-100 transition-opacity">Explore Hub →</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Categories;