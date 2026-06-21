import React from "react";
import CountDown from "./CountDown";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/actions/cart";
import { Link } from "react-router-dom";
import { ui } from "../../styles/theme";

const EventCard = ({ data }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  const isEventConcluded = (data?.Finish_Date || data?.FinishDate) && (new Date(data.Finish_Date || data.FinishDate) - new Date() <= 0);

  const addToCartHandler = (product) => {
    if (isEventConcluded) {
      toast.error("This event has ended and is no longer available.");
      return;
    }
    if (cart?.find((i) => i._id === product._id)) {
      toast.error("Already in your cart");
      return;
    }
    if (product.stock < 1) {
      toast.error("Out of stock");
      return;
    }
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success("Added to cart");
  };

  return (
    <div className={`${ui.card} overflow-hidden flex flex-col lg:flex-row`}>
      <div className="lg:w-2/5 shrink-0">
        <img src={data.images[0]?.url} alt={data.name} className="w-full h-56 lg:h-full object-cover" />
      </div>
      <div className="p-6 flex flex-col justify-between flex-1 gap-4">
        <div>
          <span className={`${ui.badge} ${ui.badgeYellow} mb-2`}>Limited offer</span>
          <h2 className="text-xl font-semibold text-gray-900">{data?.name}</h2>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{data?.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs text-gray-500">Price</p>
            <p className="text-2xl font-bold text-teal-800">${data.discountPrice}</p>
            {data.originalPrice > data.discountPrice && (
              <p className="text-sm text-gray-400 line-through">${data.originalPrice}</p>
            )}
          </div>
          <span className={`${ui.badge} ${ui.badgeGray}`}>{data?.sold_out ?? data?.soldOut ?? 0} sold</span>
          <div className="text-sm text-gray-600">
            Ends in: <CountDown data={data} />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={`/product/${data._id}?isEvent=true`} className={ui.btnSecondary}>
            View details
          </Link>
          {isEventConcluded ? (
            <button type="button" className={`${ui.btnPrimary} !bg-gray-400 !border-gray-400 opacity-50 cursor-not-allowed`} disabled>
              Event Ended / Not Available
            </button>
          ) : (
            <button type="button" onClick={() => addToCartHandler(data)} className={ui.btnPrimary}>
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
