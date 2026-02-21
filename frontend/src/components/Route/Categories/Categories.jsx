import { useState } from 'react';
import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState({});

  const getImageUrl = (image) => {
    // Handle null/undefined
    if (!image) return "/placeholder.png";
    
    // Handle Cloudinary object format: { public_id: "...", url: "..." }
    if (typeof image === "object" && image.url) {
      return image.url;
    }
    
    // Handle array of images (take first one)
    if (Array.isArray(image) && image.length > 0) {
      return image[0].url || image[0];
    }
    
    // Handle direct URL string
    if (typeof image === "string" && image.startsWith("http")) {
      return image;
    }
    
    // Fallback
    return "/placeholder.png";
  };

  const handleImageError = (categoryId, e) => {
    // Prevent infinite loop by only setting error once per image
    if (!imageErrors[categoryId]) {
      setImageErrors(prev => ({ ...prev, [categoryId]: true }));
      e.target.src = "/placeholder.png";
    }
  };

  return (
    <>
      {/* Branding Section */}
      <div className={`${styles.section} hidden sm:block`}>
        <div className="branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md">
          {brandingData &&
            brandingData.map((i, index) => (
              <div className="flex items-start" key={i.id || index}>
                {i.icon}
                <div className="px-3">
                  <h3 className="font-bold text-sm md:text-base">{i.title}</h3>
                  <p className="text-xs md:text-sm">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Categories Section */}
      <div
        id="categories"
        className={`${styles.section} bg-white p-6 rounded-lg mb-12`}
      >
        <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-2.5 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5 xl:gap-[30px]">
          {categoriesData &&
            categoriesData.map((i) => {
              const handleSubmit = () => {
                navigate(`/products?category=${i.title}`);
              };

              // Support multiple possible field names from API
              const categoryImage = i.images || i.image_Url || i.imageUrl || i.image;
              const imageUrl = imageErrors[i._id || i.id] 
                ? "/placeholder.png" 
                : getImageUrl(categoryImage);

              return (
                <div
                  className="w-full h-[100px] flex items-center justify-between cursor-pointer overflow-hidden"
                  key={i._id || i.id}
                  onClick={handleSubmit}
                >
                  <h5 className="text-[18px] leading-[1.3]">{i.title || i.name}</h5>
                  <img
                    src={imageUrl}
                    className="w-[120px] object-cover"
                    alt={i.title || i.name}
                    onError={(e) => handleImageError(i._id || i.id, e)}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Categories;