import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import { 
  MdOutlineInventory2, 
  MdOutlineLocalShipping, 
  MdOutlineDomainVerification, 
  MdOutlineFactCheck 
} from "react-icons/md";
import { RiTruckLine } from "react-icons/ri";
import { AiOutlineFileSearch } from "react-icons/ai";
import { ui } from "../../styles/theme";

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (user?._id) dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user?._id]);

  const data = orders && orders.find((item) => item._id === id);

  const steps = [
    { status: "Processing", label: "Processing", desc: "Your order is being prepared by the seller.", icon: <AiOutlineFileSearch size={24} /> },
    { status: "Transferred to delivery partner", label: "Transferred to Partner", desc: "Your package has been handed over to the logistics partner.", icon: <MdOutlineInventory2 size={24} /> },
    { status: "Shipping", label: "Shipping", desc: "Your package is currently in transit.", icon: <RiTruckLine size={24} /> },
    { status: "Received", label: "Received at Hub", desc: "Your package has reached the local delivery hub.", icon: <MdOutlineDomainVerification size={24} /> },
    { status: "On the way", label: "Out for Delivery", desc: "Your package is on the way to your address.", icon: <MdOutlineLocalShipping size={24} /> },
    { status: "Delivered", label: "Delivered", desc: "Your package has been delivered successfully.", icon: <MdOutlineFactCheck size={24} /> },
  ];

  const currentStatus = data?.status;
  const activeIndex = steps.findIndex(s => s.status === currentStatus);

  return (
    <div className={ui.card}>
      <div className={ui.cardPadding}>
        <div className="mb-8">
          <h2 className={ui.title}>Track Order</h2>
          <p className={ui.subtitle}>Order ID: <span className="font-medium text-gray-900">{id}</span></p>
        </div>

        <div className="relative pl-6 sm:pl-8 py-4">
          {/* Vertical Connector Line */}
          <div className="absolute left-[38px] sm:left-[46px] top-8 bottom-8 w-0.5 bg-gray-200 z-0" />

          {steps.map((step, index) => {
            const isCompleted = index <= activeIndex;
            const isActive = index === activeIndex;

            return (
              <div key={index} className="relative z-10 flex gap-6 pb-10 last:pb-0 group">
                {/* Circle Icon */}
                <div className={`
                      flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-4 border-white shadow-sm relative -left-1
                      ${isCompleted ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-400"}
                      ${isActive ? "ring-4 ring-teal-100 shadow-md scale-110" : ""}
                   `}>
                  {step.icon}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <h4 className={`text-base font-semibold ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                    {step.label}
                  </h4>
                  <p className={`text-sm mt-1 ${isCompleted ? "text-gray-600" : "text-gray-400"}`}>
                    {step.desc}
                  </p>
                  {isActive && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full">
                      <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-pulse" /> Current Status
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Special Status Handling for Refunds */}
        {(currentStatus === "Processing refund" || currentStatus === "Refund Success") && (
          <div className="mt-8 p-6 bg-orange-50 border border-orange-100 rounded-xl">
            <h4 className="text-base font-semibold text-orange-800 mb-1">Refund Status</h4>
            <p className="text-sm text-orange-700">
              {currentStatus === "Processing refund" 
                ? "Your refund is currently being processed and will be credited to your original payment method shortly." 
                : "Your refund has been successfully completed."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;