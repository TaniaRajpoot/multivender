import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import { MdOutlineInventory2, MdOutlineLocalShipping, MdOutlineDomainVerification, MdOutlineFactCheck } from "react-icons/md";
import { RiTruckLine } from "react-icons/ri";
import { AiOutlineFileSearch } from "react-icons/ai";

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
    { status: "Processing", label: "Protocol Initiated", desc: "Order is being synthesized in the merchant facility.", icon: <AiOutlineFileSearch size={24} /> },
    { status: "Transferred to delivery partner", label: "Merchant Handover", desc: "Package successfully transferred to logistics unit.", icon: <MdOutlineInventory2 size={24} /> },
    { status: "Shipping", label: "In Transit", desc: "Logistic carrier is currently in transit to your sector.", icon: <RiTruckLine size={24} /> },
    { status: "Received", label: "Regional Arrival", desc: "Inventory received at the local distribution hub.", icon: <MdOutlineDomainVerification size={24} /> },
    { status: "On the way", label: "Final Descent", desc: "Assigned courier is approaching your destination.", icon: <MdOutlineLocalShipping size={24} /> },
    { status: "Delivered", label: "Mission Complete", desc: "Package successfully deposited at the target coordinates.", icon: <MdOutlineFactCheck size={24} /> },
  ];

  const currentStatus = data?.status;
  const activeIndex = steps.findIndex(s => s.status === currentStatus);

  return (
    <div className="w-full min-h-[80vh] py-12 px-4 md:px-8 bg-[#EDE7E3]/30 font-Inter">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-16 animate-in slide-in-from-top duration-700">
          <h2 className="text-2xl font-black text-[#16697A] tracking-tighter italic uppercase">Track Sequence</h2>
          <p className="text-[#489FB5] text-[10px] font-black uppercase tracking-[0.4em] mt-1">Real-Time Logistics Telemetry</p>
          <div className="w-16 h-1 bg-[#FFA62B] mx-auto mt-4 rounded-full" />
        </div>

        <div className="bg-white/70 backdrop-blur-2xl rounded-[48px] p-8 md:p-16 border border-white shadow-soft animate-in zoom-in duration-500">

          <div className="space-y-0 relative">
            {/* Vertical Connector Line */}
            <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-[#EDE7E3] z-0" />

            {steps.map((step, index) => {
              const isCompleted = index <= activeIndex;
              const isActive = index === activeIndex;

              return (
                <div key={index} className="relative z-10 flex gap-8 pb-12 last:pb-0 group">
                  {/* Circle Icon */}
                  <div className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 border-4 border-white shadow-lg
                        ${isCompleted ? "bg-[#16697A] text-white" : "bg-white text-[#6B7280]/20"}
                        ${isActive ? "ring-4 ring-[#FFA62B] scale-110 shadow-2xl animate-pulse" : ""}
                     `}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h4 className={`text-lg font-black tracking-tight transition-colors duration-500 ${isCompleted ? "text-[#16697A]" : "text-[#6B7280]/30"}`}>
                      {step.label}
                    </h4>
                    <p className={`text-sm font-medium mt-1 leading-relaxed transition-opacity duration-700 ${isCompleted ? "text-[#489FB5] opacity-100" : "text-[#6B7280] opacity-30"}`}>
                      {step.desc}
                    </p>
                    {isActive && (
                      <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFA62B]/10 text-[#FFA62B] text-[10px] font-black uppercase tracking-widest rounded-full animate-in slide-in-from-left duration-500">
                        <span className="w-1.5 h-1.5 bg-[#FFA62B] rounded-full animate-ping" /> Current Sector
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Special Status Handling for Refunds */}
          {(currentStatus === "Processing refund" || currentStatus === "Refund Success") && (
            <div className="mt-12 p-8 bg-black text-white rounded-[32px] shadow-2xl border border-white/10 animate-in slide-in-from-bottom duration-500">
              <h4 className="text-lg font-black tracking-tight italic uppercase mb-2">Reverse Protocol Active</h4>
              <p className="text-[#82C0CC] text-sm font-bold">{currentStatus === "Processing refund" ? "Capital reversal is being synchronized with financial nodes." : "Refund sequence finalized. Capital returned to origin source."}</p>
            </div>
          )}

        </div>

        <div className="mt-12 text-center">
          <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest opacity-50">Encryption: 256-Bit SSL Secured Logistics Stream</p>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;