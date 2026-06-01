import { useState } from "react";
import { brandingData, categoriesData } from "../../../static/data";
import { useNavigate } from "react-router-dom";
import SectionTitle from "../../ui/SectionTitle";
import { ui } from "../../../styles/theme";

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

const Categories = () => {
  const navigate = useNavigate();
  const [failedImages, setFailedImages] = useState({});

  const getImageSrc = (item) => {
    if (failedImages[item.id]) return FALLBACK_IMAGES[item.id];
    return item.image_Url || FALLBACK_IMAGES[item.id];
  };

  return (
    <section className={`${ui.section} bg-white`}>
      <div className={ui.container}>
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {brandingData?.map((i, index) => (
            <div key={i.id || index} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-12 h-12 flex items-center justify-center bg-teal-700 text-white rounded-lg shrink-0">
                {i.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{i.title}</h3>
                <p className="text-gray-500 text-xs mt-0.5">{i.Description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <SectionTitle title="Shop by category" subtitle="Browse products grouped by type." center={false} />
          <button type="button" onClick={() => navigate("/products")} className={ui.btnSecondary}>
            View all products
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categoriesData?.map((item, index) => {
            const title = item.title || item.name;
            return (
              <button
                key={index}
                type="button"
                onClick={() => navigate(`/products?category=${title}`)}
                className={`${ui.cardHover} p-4 text-left group`}
              >
                <div className="aspect-square rounded-lg bg-gray-100 mb-3 overflow-hidden flex items-center justify-center">
                  <img
                    src={getImageSrc(item)}
                    alt={title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition"
                    onError={() => setFailedImages((prev) => ({ ...prev, [item.id]: true }))}
                  />
                </div>
                <p className="font-semibold text-sm text-gray-900">{title}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
