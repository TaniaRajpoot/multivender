import React, { useEffect, useState } from "react";
import ProductCard from "../Route/ProductCard/ProductCard";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { getAllEventsShop } from "../../redux/actions/event";
import Ratings from "../Products/Ratings";
import { ui } from "../../styles/theme";

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
      <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-6 mb-8 border-b border-gray-200">
        <div className="flex flex-wrap gap-6 md:gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`relative py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                active === tab.id ? "text-teal-700 font-bold" : "text-gray-500 hover:text-teal-700"
              }`}
            >
              {tab.label}
              {active === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-700 rounded-full animate-in slide-in-from-left duration-300" />
              )}
            </button>
          ))}
        </div>

        {isOwner && (
          <Link to="/dashboard" className="pb-2 sm:pb-0">
            <button className={`${ui.btnPrimary} !py-2 !px-4 text-xs uppercase tracking-wider`}>
              Go to Dashboard
            </button>
          </Link>
        )}
      </div>

      {/* Dynamic Content Grid */}
      <div className="min-h-[50vh]">
        {/* Products Grid */}
        {active === 1 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-700">
            {products?.length > 0 ? (
              products.map((p) => <ProductCard key={p._id} data={p} isShop />)
            ) : (
              <div className="col-span-full py-16 text-center text-gray-500">
                <p className="text-sm">No products listed for this shop yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Events Grid */}
        {active === 2 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-700">
            {events?.length > 0 ? (
              events.map((e) => <ProductCard key={e._id} data={e} isShop isEvent />)
            ) : (
              <div className="col-span-full py-16 text-center text-gray-500">
                <p className="text-sm">No live events listed for this shop yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Reviews Section */}
        {active === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-700">
            {allReviews?.length > 0 ? (
              allReviews.map((r, index) => (
                <div className={`${ui.card} ${ui.cardPadding} space-y-4`} key={index}>
                  <div className="flex items-center gap-3">
                    <img src={getImageUrl(r.user.avatar)} className="w-10 h-10 rounded-lg object-cover border border-gray-200" alt={r.user.name} />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{r.user.name}</h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Ratings rating={r.rating} />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">"{r.comment}"</p>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-gray-500">
                <p className="text-sm">No reviews found for this shop yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopProfileData;