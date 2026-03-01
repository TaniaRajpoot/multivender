import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriesData } from '../../static/data';

// ✅ Same reliable fallback images as Categories component
const FALLBACK_IMAGES = {
  1: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&q=80",
  2: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&q=80",
  3: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&q=80",
  4: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&q=80",
  5: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80",
  6: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&q=80",
  7: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&q=80",
  8: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&q=80",
  9: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=100&q=80",
  10: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=100&q=80",
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

const DropDown = ({ setDropDown, categoriesData }) => {
  const navigate = useNavigate();

  const handleClick = (category) => {
    navigate(`/products?category=${category.title}`);
    setDropDown(false);
    window.location.reload();
  };

  return (
    <div className="w-[90vw] max-w-[1200px] bg-white/70 backdrop-blur-3xl absolute top-full left-0 z-50 rounded-[40px] shadow-3xl border border-white overflow-hidden p-10 animate-in slide-in-from-top-4 duration-500">
      {/* Header section in dropdown */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#16697A]/5">
        <div>
          <h3 className="text-sm font-black text-[#16697A] tracking-tighter italic uppercase font-display">Marketplace Matrix</h3>
          <p className="text-[9px] font-black text-[#489FB5] uppercase tracking-[0.3em] font-display opacity-60">Categorical Assets Hub</p>
        </div>
        <div className="flex gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFA62B] animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-[#489FB5]" />
          <span className="w-2 h-2 rounded-full bg-[#16697A]" />
        </div>
      </div>

      {/* Hero Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categoriesData &&
          categoriesData.map((item, index) => {
            const imgSrc = item.image_Url || FALLBACK_IMAGES[item.id];
            const colorClass = CATEGORY_COLORS[item.id] || "bg-[#EDE7E3]";

            return (
              <div
                key={index}
                onClick={() => handleClick(item)}
                className="group relative cursor-pointer"
              >
                {/* Card Container */}
                <div className={`
                   relative h-44 rounded-[32px] overflow-hidden transition-all duration-500 transform 
                   group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-[#16697A]/10
                   border border-white/50 bg-gradient-to-br from-white/80 to-transparent
                `}>
                  {/* Category Image - Large & Stylized */}
                  <div className={`absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20 ${colorClass}`} />
                  <img
                    src={imgSrc}
                    alt={item.title}
                    className="absolute right-[-10%] bottom-[-10%] w-32 h-32 object-contain transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-6 drop-shadow-2xl"
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGES[item.id] || FALLBACK_IMAGES[10];
                    }}
                  />

                  {/* Icon & Label */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${colorClass.replace('bg-', 'bg-opacity-20 bg-')} flex items-center justify-center backdrop-blur-md border border-white/40 shadow-sm`}>
                      <div className="w-2 h-2 bg-[#16697A] rounded-full group-hover:scale-150 transition-transform" />
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-[#16697A] leading-tight uppercase tracking-tight group-hover:text-[#FFA62B] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[9px] font-black text-[#489FB5] uppercase tracking-widest mt-1 opacity-60">Explore Hub →</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Footer hint */}
      <div className="mt-8 pt-6 border-t border-[#16697A]/5 text-center">
        <p className="text-[9px] font-black text-[#6B7280] uppercase tracking-[0.5em] opacity-40">Secure Categorical Navigation Active</p>
      </div>
    </div>
  );
};

export default DropDown;