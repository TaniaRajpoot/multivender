
import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller]);

  const order = orders?.find((item) => item._id === id);

  const orderUpdateHandler = async () => {
    try {
      await axios.put(
        `${server}/order/update-order-status/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success("Order status updated!");
      navigate("/dashboard-orders");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  const refundOrderUpdateHandler = async () => {
    try {
      await axios.put(
        `${server}/order/order-refund-success/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success("Refund status updated!");
      dispatch(getAllOrdersOfShop(seller._id));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  if (!order) return <h2 className="text-center mt-20">Loading order details...</h2>;

  const statusOptions = order?.status === "Processing refund" || order?.status === "Refund Success"
    ? ["Processing refund", "Refund Success"]
    : ["Processing", "Transferred to delivery partner", "Shipping", "Received", "On the way", "Delivered"].slice(
      ["Processing", "Transferred to delivery partner", "Shipping", "Received", "On the way", "Delivered"].indexOf(order.status)
    );

  return (
    <div className={`py-8 min-h-screen ${styles.section}`}>
      <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 border border-white shadow-soft">
        <div className="w-full flex items-center justify-between pb-8 border-b border-[#16697A]/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#16697A] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <BsFillBagFill size={24} />
            </div>
            <div>
              <h1 className={`${styles.heading} !pb-0`}>Order Details</h1>
              <p className="text-[12px] font-bold text-[#16697A]/60 uppercase tracking-widest mt-1">Manage single order flow</p>
            </div>
          </div>
          <Link to="/dashboard-orders">
            <div className={`${styles.button} !my-0`}>
              Order List
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
          <div className="bg-[#EDE7E3]/40 rounded-3xl p-6 border border-white/50">
            <h5 className="text-[10px] font-black text-[#16697A]/40 uppercase tracking-[0.3em] mb-2">Order Identification</h5>
            <p className="text-lg font-black text-[#16697A]">#{order._id}</p>
          </div>
          <div className="bg-[#EDE7E3]/40 rounded-3xl p-6 border border-white/50">
            <h5 className="text-[10px] font-black text-[#16697A]/40 uppercase tracking-[0.3em] mb-2">Placement Date</h5>
            <p className="text-lg font-black text-[#16697A]">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-10">
          <h4 className="text-[14px] font-black text-[#16697A] uppercase tracking-widest mb-6 px-2">Purchased Items</h4>
          <div className="space-y-4">
            {order.cart?.map((item, idx) => (
              <div key={idx} className="group bg-white/50 hover:bg-white rounded-3xl p-4 flex items-center gap-6 border border-transparent hover:border-[#16697A]/10 transition-all duration-300">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-500">
                  <img src={item.images[0]?.url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h5 className="text-[16px] font-black text-[#16697A] uppercase tracking-wide mb-1">{item.name}</h5>
                  <p className="text-[14px] font-bold text-[#489FB5]">
                    US${item.discountPrice} <span className="text-[#16697A]/30 mx-2">x</span> {item.qty}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[16px] font-black text-[#FFA62B]">US${(item.discountPrice * item.qty).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end px-6">
            <div className="text-right">
              <p className="text-[10px] font-black text-[#16697A]/40 uppercase tracking-widest mb-1">Grand Total</p>
              <h2 className="text-3xl font-black text-[#16697A]">US${order.totalPrice}</h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-[#16697A]/5 rounded-[32px] p-8 border border-white/50 backdrop-blur-sm">
            <h4 className="text-[12px] font-black text-[#16697A] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#FFA62B] rounded-full shadow-glow" />
              Shipping Information
            </h4>
            <div className="space-y-2 text-[#16697A]/80 font-bold">
              <p className="text-lg text-[#16697A] font-black">{order.user?.name}</p>
              <p>{order.shippingAddress.address1} {order.shippingAddress.address2}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.country}</p>
              <p className="pt-2 text-[#489FB5]">{order.user?.phoneNumber}</p>
            </div>
          </div>

          <div className="bg-[#16697A]/5 rounded-[32px] p-8 border border-white/50 backdrop-blur-sm">
            <h4 className="text-[12px] font-black text-[#16697A] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#FFA62B] rounded-full shadow-glow" />
              Payment Details
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black text-[#16697A]/40 uppercase tracking-widest mb-1">Payment Status</p>
                <div className={`inline-flex px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest ${order.paymentInfo?.status === "Succeeded"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-orange-100 text-orange-700 border border-orange-200"
                  }`}>
                  {order.paymentInfo?.status || "Pending"}
                </div>
              </div>
              {order.paymentInfo?.type && (
                <div>
                  <p className="text-[10px] font-black text-[#16697A]/40 uppercase tracking-widest mb-1">Method</p>
                  <p className="text-[14px] font-black text-[#16697A] uppercase">{order.paymentInfo.type}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#16697A] rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10 lg:flex items-center justify-between">
            <div>
              <h4 className="text-[18px] font-black uppercase tracking-widest mb-2">Order Fulfillment</h4>
              <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">Update current shipping status</p>
            </div>
            <div className="mt-6 lg:mt-0 flex flex-wrap items-center gap-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-white/10 border border-white/20 text-white font-black text-[13px] uppercase tracking-wider rounded-2xl px-6 h-[50px] outline-none focus:bg-white/20 transition-all cursor-pointer min-w-[240px]"
              >
                <option value="" className="text-gray-800">Select Status</option>
                {statusOptions.map((option, idx) => (
                  <option key={idx} value={option} className="text-gray-800">{option}</option>
                ))}
              </select>

              <div
                className="bg-[#FFA62B] text-[#16697A] font-black text-[13px] uppercase tracking-[0.2em] px-10 h-[50px] flex items-center justify-center rounded-2xl cursor-pointer hover:bg-white transition-all duration-500 shadow-xl"
                onClick={order.status === "Processing refund" || order.status === "Refund Success" ? refundOrderUpdateHandler : orderUpdateHandler}
              >
                Apply Changes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;