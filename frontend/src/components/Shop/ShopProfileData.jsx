import React, { useEffect, useState } from "react";
import ProductCard from "../Route/ProductCard/ProductCard";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { getAllEventsShop } from "../../redux/actions/event";
import Ratings from "../Products/Ratings";

const ShopProfileData = ({ isOwner }) => {
  const dispatch = useDispatch();
  const { id: paramId } = useParams();
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.product);
  const { events } = useSelector((state) => state.events);

  const shopId = paramId || seller?._id;

  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    if (typeof image === "object" && image.url) return image.url;
    if (typeof image === "string" && image.startsWith("http")) return image;
    return image;
  };

  useEffect(() => {
    if (shopId) {
      dispatch(getAllProductsShop(shopId));
      dispatch(getAllEventsShop(shopId));
    }
  }, [dispatch, shopId]);

  const allReviews = products ? products.map((p) => p.reviews || []).flat() : [];

  const [active, setActive] = useState(1);

  const tabs = [
    { id: 1, label: "Shop Products" },
    { id: 2, label: "Running Events" },
    { id: 3, label: "Shop Reviews" },
  ];

  return (
    <div className="w-full">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between gap-6 mb-8">
        <div className="flex flex-wrap gap-8 md:gap-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`relative py-4 text-sm md:text-base font-[700] transition-all uppercase tracking-[0.2em] font-sans ${active === tab.id ? "text-[#16697A]" : "text-[#6B7280]/60 hover:text-[#16697A]"
                }`}
            >
              {tab.label}
              {active === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FFA62B] rounded-full animate-in slide-in-from-left duration-300" />
              )}
            </button>
          ))}
        </div>

        {isOwner && (
          <Link to="/dashboard">
            <button className="h-14 px-10 bg-[#16697A] text-[#EDE7E3] font-[700] uppercase tracking-[0.1em] text-[13px] rounded-2xl hover:bg-[#FFA62B] transition-all duration-500 shadow-xl font-sans">
              Go to Dashboard
            </button>
          </Link>
        )}
      </div>

      {/* Dynamic Content Grid */}
      <div className="min-h-[60vh]">
        {/* Products Grid */}
        {active === 1 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-700">
            {products?.length > 0 ? (
              products.map((p) => <ProductCard key={p._id} data={p} isShop />)
            ) : (
              <div className="col-span-full py-16 text-center">
                <h4 className="text-xl font-[700] text-[#16697A] font-display italic">No products for this shop!</h4>
              </div>
            )}
          </div>
        )}

        {/* Events Grid */}
        {active === 2 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-700">
            {events?.length > 0 ? (
              events.map((e) => <ProductCard key={e._id} data={e} isShop isEvent />)
            ) : (
              <div className="col-span-full py-16 text-center">
                <h4 className="text-xl font-[700] text-[#16697A] font-display italic">No events for this shop!</h4>
              </div>
            )}
          </div>
        )}

        {/* Reviews Section */}
        {active === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-700">
            {allReviews?.length > 0 ? (
              allReviews.map((r, index) => (
                <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border border-white shadow-soft transition-all" key={index}>
                  <div className="flex items-center gap-4 mb-6">
                    <img src={getImageUrl(r.user.avatar)} className="w-14 h-14 rounded-2xl object-cover shadow-md" alt={r.user.name} />
                    <div>
                      <h4 className="font-[700] text-[#16697A] font-sans">{r.user.name}</h4>
                      <div className="flex items-center gap-2">
                        <Ratings rating={r.rating} />
                      </div>
                    </div>
                  </div>
                  <p className="text-[#6B7280] font-[500] leading-relaxed font-sans italic">"{r.comment}"</p>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <h4 className="text-xl font-[700] text-[#16697A] font-display italic">No reviews for this shop!</h4>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopProfileData;