import React from 'react';
import { useNavigate } from 'react-router-dom';

const DropDown = ({ setDropDown, categoriesData }) => {
  const navigate = useNavigate();

  const handleClick = (category) => {
    navigate(`/products?category=${category.title}`);
    setDropDown(false);
    window.location.reload();
  };

  return (
    <div className="w-[200px] bg-white absolute top-full left-0 z-50 rounded-xl shadow-lg border border-gray-200 overflow-hidden py-1 mt-1.5 animate-in fade-in duration-200">
      {categoriesData &&
        categoriesData.map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(item)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-teal-50 cursor-pointer group transition-colors border-b border-gray-50 last:border-b-0"
          >
            {/* Color bullet dot indicator */}
            <div className="w-1.5 h-1.5 rounded-full bg-teal-600 group-hover:scale-110 transition-transform" />
            
            <span className="text-xs font-medium text-gray-700 group-hover:text-teal-700 transition-colors">
              {item.title}
            </span>
          </div>
        ))}
    </div>
  );
};

export default DropDown;