import React, { useEffect, useState } from "react";
import { BsFillBagFill, BsChatDots } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import axios from "axios";
import { toast } from "react-toastify";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [rating, setRating] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const data = orders && orders.find((item) => item._id === id);

  useEffect(() => {
    if (user?._id) dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user?._id]);

  const reviewHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${server}/product/create-new-review`, {
        user, rating, comment, productId: selectedItem?._id, orderId: id,
      }, { withCredentials: true });
      toast.success("Review registered in central archive");
      dispatch(getAllOrdersOfUser(user._id));
      setComment(""); setRating(1); setOpen(false);
    } catch (error) {
      toast.error("Review transmission failed");
    }
  };

  const refundHandler = async () => {
    try {
      await axios.put(`${server}/order/order-refund/${id}`, { status: "Processing refund" });
      toast.success("Refund sequence initiated");
      dispatch(getAllOrdersOfUser(user._id));
    } catch (error) {
      toast.error("Refund request failed");
    }
  };

  return (
    <div className="bg-[#EDE7E3]/30 min-h-screen font-Inter p-8 md:p-12">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Elite Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#16697A]/10 pb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#16697A] rounded-2xl flex items-center justify-center text-white shadow-xl">
                <BsFillBagFill size={24} />
              </div>
              <p className="text-[10px] font-black text-[#489FB5] uppercase tracking-[0.4em]">Acquisition Manifest</p>
            </div>
            <h1 className="text-3xl font-black text-[#16697A] tracking-tighter italic">ORDER DETAILS</h1>
            <p className="text-[#6B7280] font-bold mt-2 opacity-60">ID: #{data?._id?.toUpperCase()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-1">Status Protocol</p>
            <div className="inline-block px-6 py-2 bg-white text-[#16697A] font-black rounded-full border border-[#16697A]/20 shadow-sm uppercase tracking-widest text-xs">
              {data?.status}
            </div>
            <p className="text-xs font-bold text-[#489FB5] mt-2 italic">Initialized on {data?.createdAt?.slice(0, 10)}</p>
          </div>
        </div>

        {/* Manifest Items */}
        <div className="space-y-6">
          {data?.cart?.map((item, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-md rounded-[40px] p-6 border border-white shadow-soft flex flex-col md:flex-row items-center gap-8 group transition-all hover:shadow-2xl">
              <div className="w-32 h-32 rounded-[32px] overflow-hidden bg-[#EDE7E3] border-4 border-white shadow-lg overflow-hidden shrink-0">
                <img src={item.images[0]?.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h5 className="text-xl font-black text-[#16697A] tracking-tight">{item.name}</h5>
                <p className="text-lg font-bold text-[#489FB5] mt-1">${item.discountPrice} <span className="text-sm font-medium text-[#6B7280]">x {item.qty} units</span></p>
              </div>
              {!item.isReviewed && data?.status === "Delivered" && (
                <button onClick={() => { setOpen(true); setSelectedItem(item); }} className="px-8 py-4 bg-[#16697A] text-white font-black rounded-2xl hover:bg-[#FFA62B] transition-all uppercase tracking-widest text-[10px] shadow-lg">
                  Submit Review
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Global Logistics Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
          <div className="bg-white/40 backdrop-blur-sm rounded-[48px] p-10 border border-white space-y-6">
            <h4 className="text-xs font-black text-[#16697A] uppercase tracking-[0.3em] border-b border-[#16697A]/5 pb-4">Destination Coordinates</h4>
            <div className="space-y-2">
              <p className="text-lg font-black text-[#16697A]">{data?.shippingAddress?.address1} {data?.shippingAddress?.address2}</p>
              <p className="text-sm font-bold text-[#489FB5]">{data?.shippingAddress?.city}, {data?.shippingAddress?.country}</p>
              <p className="text-xs font-bold text-[#6B7280] opacity-60">Mobile Node: {data?.user.phoneNumber}</p>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-sm rounded-[48px] p-10 border border-white space-y-6 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black text-[#16697A] uppercase tracking-[0.3em] border-b border-[#16697A]/5 pb-4">Financial Protocol</h4>
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#6B7280]">Settlement Status:</span>
                  <span className="text-sm font-black text-[#16697A] uppercase">{data?.paymentInfo?.status || "PENDING"}</span>
                </div>
                <div className="flex justify-between items-end border-t border-[#16697A]/5 pt-4">
                  <span className="text-xs font-black text-[#6B7280] uppercase tracking-widest">Aggregate Total</span>
                  <span className="text-3xl font-black text-[#16697A] tracking-tighter">${data?.totalPrice}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              {data?.status === "Delivered" && (
                <button onClick={refundHandler} className="flex-1 py-4 bg-[#16697A]/5 text-[#16697A] font-black rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all uppercase tracking-widest text-[10px]">
                  Initiate Refund
                </button>
              )}
              <Link to="/inbox" className="flex-1">
                <button className="w-full py-4 bg-[#16697A] text-white font-black rounded-2xl hover:bg-[#FFA62B] transition-all shadow-xl uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                  <BsChatDots size={16} /> Contact Support
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Review Modal */}
        {open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0F4D58]/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-[56px] shadow-3xl border border-white p-10 relative animate-in zoom-in duration-500">
              <button onClick={() => setOpen(false)} className="absolute top-8 right-8 w-12 h-12 bg-[#EDE7E3] text-[#16697A] rounded-2xl flex items-center justify-center hover:rotate-90 transition-all">
                <RxCross1 size={20} />
              </button>

              <h2 className="text-2xl font-black text-[#16697A] tracking-tighter text-center italic mb-8 uppercase">Product Analysis</h2>

              <div className="flex items-center gap-6 p-6 bg-[#EDE7E3]/30 rounded-[32px] border border-white mb-8">
                <img src={selectedItem?.images[0]?.url} alt="" className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
                <div>
                  <h4 className="font-black text-[#16697A]">{selectedItem?.name}</h4>
                  <p className="text-xs font-medium text-[#489FB5]">${selectedItem?.discountPrice}</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="text-center">
                  <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.4em] mb-4">Satisfaction Score</p>
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button key={i} onClick={() => setRating(i)} className={`p-2 transition-all transform hover:scale-125 ${rating >= i ? 'text-[#FFA62B] drop-shadow-lg' : 'text-[#6B7280]/20'}`}>
                        <AiFillStar size={40} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-2">Qualitative Assessment</label>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className="w-full bg-[#EDE7E3]/60 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-[32px] px-8 py-6 font-bold text-[#16697A] outline-none shadow-inner resize-none" placeholder="Provide detailed operational feedback..." />
                </div>

                <button onClick={reviewHandler} className="w-full h-16 bg-[#16697A] text-white font-black rounded-3xl hover:bg-[#FFA62B] transition-all shadow-xl uppercase tracking-[0.2em] text-sm">
                  Submit Parameters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrderDetails;