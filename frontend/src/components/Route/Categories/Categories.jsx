import React from "react";
import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();
  const { allProducts } = useSelector((state) => state.product);
  
useEffect(() => {
  if (allProducts && allProducts.length > 0) {
    console.log("=== CATEGORY FILTER DEBUG ===");
    console.log("Category from URL:", categoryData);
    console.log("Category type:", typeof categoryData);
    console.log("All products categories:", allProducts.map(p => p.category));
    
    if (categoryData === null) {
    
    } else {
      const filtered = allProducts.filter((i) => {
        console.log(`Comparing: "${i.category}" === "${categoryData}" = ${i.category === categoryData}`);
        return i.category === categoryData;
      });
      console.log("Filtered products:", filtered);
      setData(filtered);
    }
  } else {
    setData([]);
  }
}, [allProducts, categoryData]);
  // Helper function to get image URL (Cloudinary support)
  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    
    // If it's an object with url property (Cloudinary format)
    if (typeof image === "object" && image.url) {
      return image.url;
    }
    
    // If it's already a URL string
    if (typeof image === "string" && image.startsWith("http")) {
      return image;
    }
    
    // Fallback for old format
    return image;
  };

  return (
    <>
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

      <div
        id="categories"
        className={`${styles.section} bg-white p-6 rounded-lg mb-12`}
      >
        <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]">
          {categoriesData &&
            categoriesData.map((i) => {
              const handleSubmit = () => {
                navigate(`/products?category=${i.title}`);
              };

              // Get the image URL - handles both image_Url and imageUrl
              const categoryImage = i.image_Url || i.imageUrl;

              return (
                <div
                  className="w-full h-[100px] flex items-center justify-between cursor-pointer overflow-hidden"
                  key={i.id}
                  onClick={handleSubmit}
                >
                  <h5 className="text-[18px] leading-[1.3]">{i.title}</h5>
                  <img
                    src={getImageUrl(categoryImage)}
                    className="w-[120px] object-cover"
                    alt={i.title}
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
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