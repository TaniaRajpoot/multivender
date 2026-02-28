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

const DropDown = ({ setDropDown }) => {
  const navigate = useNavigate();

  const handleClick = (category) => {
    navigate(`/products?category=${category.title}`);
    setDropDown(false);
    window.location.reload();
  };

  return (
    <div className="w-[270px] bg-white absolute top-full left-0 z-30 rounded-b-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Browse Categories</p>
      </div>

      {/* Category List */}
      <div className="max-h-[60vh] overflow-y-auto">
        {categoriesData &&
          categoriesData.map((item, index) => {
            const imgSrc = item.image_Url || FALLBACK_IMAGES[item.id];
            const colorClass = CATEGORY_COLORS[item.id] || "bg-gray-50";

            return (
              <div
                key={index}
                onClick={() => handleClick(item)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors group border-b border-gray-50 last:border-0"
              >
                {/* Icon container */}
                <div className={`w-9 h-9 rounded-xl ${colorClass} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                  <img
                    src={imgSrc}
                    alt={item.title}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGES[item.id] || FALLBACK_IMAGES[10];
                    }}
                  />
                </div>

                {/* Title */}
                <span className="text-sm text-gray-700 font-medium group-hover:text-[#3321c8] transition-colors select-none">
                  {item.title}
                </span>

                {/* Arrow */}
                <svg
                  className="w-3.5 h-3.5 text-gray-300 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DropDown;