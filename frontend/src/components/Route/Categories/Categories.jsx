import { useState } from 'react';
import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";
import styles from "../../../styles/styles";
import { useNavigate } from "react-router-dom";

// ✅ Reliable replacement images — all original URLs in data.js were broken
const FALLBACK_IMAGES = {
  1: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80",   // Computers and Laptops
  2: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&q=80",   // Cosmetics and Body Care
  3: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80",      // Accessories
  4: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80",   // Cloths
  5: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80",      // Shoes
  6: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&q=80",      // Gifts
  7: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&q=80",   // Pet Care
  8: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80",   // Mobile and Tablets
  9: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&q=80",   // Music and Gaming
  10: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=80",  // Others
};

// Soft gradient per card for visual variety
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
    // If already marked as failed, use reliable fallback
    if (failedImages[item.id]) return FALLBACK_IMAGES[item.id];

    // Try original URL from data
    const raw = item.image_Url || item.images || item.imageUrl || item.image;
    if (typeof raw === "string" && raw.startsWith("http")) return raw;
    if (typeof raw === "object" && raw?.url) return raw.url;
    if (Array.isArray(raw) && raw.length > 0) return raw[0]?.url || raw[0];

    // Default fallback
    return FALLBACK_IMAGES[item.id] || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=80";
  };

  return (
    <>
      {/* ── Branding Strip ── */}
      <div className={`${styles.section} hidden sm:block`}>
        <div className="my-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {brandingData &&
            brandingData.map((i, index) => (
              <div
                key={i.id || index}
                className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="shrink-0">{i.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{i.title}</h3>
                  <p className="text-gray-400 text-xs mt-0.5">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ── Categories Section ── */}
      <div id="categories" className={`${styles.section} mb-14`}>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Shop by Category</h2>
            <p className="text-gray-400 text-sm mt-1">Browse our wide selection of products</p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categoriesData &&
            categoriesData.map((item) => {
              const id = item.id;
              const title = item.title || item.name;
              const imgSrc = getImageSrc(item);
              const gradient = CARD_GRADIENTS[id] || "from-gray-50 to-gray-100";

              return (
                <div
                  key={id}
                  onClick={() => navigate(`/products?category=${title}`)}
                  className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-100 bg-white hover:border-transparent hover:shadow-xl transition-all duration-300"
                >
                  {/* Coloured image area */}
                  <div className={`relative h-[130px] bg-linear-to-br ${gradient} overflow-hidden`}>
                    <img
                      src={imgSrc}
                      alt={title}
                      className="absolute right-0 bottom-0 h-[110px] w-[110px] object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [id]: true }))
                      }
                    />
                    {/* Hover shimmer */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  </div>

                  {/* Label */}
                  <div className="px-3 py-3">
                    <h5 className="text-[13px] font-semibold text-gray-700 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                      {title}
                    </h5>
                    <p className="text-[11px] text-gray-400 mt-0.5">Shop now →</p>
                  </div>
                </div>
              );
            })}
