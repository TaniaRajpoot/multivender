import React, { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";
import { ui } from "../../styles/theme";

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
  }, [dispatch, seller?._id]);

  const order = orders?.find((item) => String(item._id) === String(id));

  useEffect(() => {
    if (order?.status) {
      setStatus(order.status);
    }
  }, [order]);

  const orderUpdateHandler = async () => {
    try {
      await axios.put(
        `${server}/order/update-order-status/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success("Order status updated!");
      dispatch(getAllOrdersOfShop(seller._id));
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
      navigate("/dashboard-refunds");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  if (isLoading) return <Loader />;

  if (!order) {
    return (
      <div className="py-20 text-center max-w-xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Order not found</h2>
        <p className="text-sm text-gray-500">This order may have been removed or you do not have access.</p>
        <Link
          to="/dashboard-orders"
          className={ui.btnPrimary}
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const statusOptions = order?.status === "Processing refund" || order?.status === "Refund Success"
    ? ["Processing refund", "Refund Success"]
    : ["Processing", "Transferred to delivery partner", "Shipping", "Received", "On the way", "Delivered"].slice(
      ["Processing", "Transferred to delivery partner", "Shipping", "Received", "On the way", "Delivered"].indexOf(order.status)
    );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className={`${ui.card} ${ui.cardPadding} space-y-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center shrink-0">
              <BsFillBagFill size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Order details</h1>
              <p className="text-xs text-gray-500 mt-0.5">Review items and update shipping status</p>
            </div>
          </div>
          <Link to="/dashboard-orders" className={ui.btnSecondary}>
            Back to Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Order ID</span>
            <span className="text-sm font-semibold text-gray-900 mt-1 block">#{order._id}</span>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Order Date</span>
            <span className="text-sm font-semibold text-gray-900 mt-1 block">
              {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Purchased Items</h4>
          <div className="space-y-3">
            {order.cart?.map((item, idx) => (
              <div key={idx} className="bg-gray-50/50 hover:bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100 transition">
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                  <img src={item.images[0]?.url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h5>
                  <p className="text-xs text-gray-500 mt-0.5">
                    ${item.discountPrice} x {item.qty}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">${(item.discountPrice * item.qty).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <div className="text-right">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Paid</span>
              <h2 className="text-xl font-bold text-teal-700 mt-0.5">${order.totalPrice}</h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Shipping Address</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-semibold text-gray-900">{order.user?.name}</p>
              <p>{order.shippingAddress.address1} {order.shippingAddress.address2}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.country}</p>
              <p className="text-teal-700 pt-1 text-xs">{order.user?.phoneNumber}</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment Details</h4>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Status</span>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  order.paymentInfo?.status === "Succeeded"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {order.paymentInfo?.status || "Pending"}
                </span>
              </div>
              {order.paymentInfo?.type && (
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Method</span>
                  <span className="text-xs font-semibold text-gray-700 mt-0.5 block uppercase">{order.paymentInfo.type}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fulfillment Control */}
        <div className="bg-teal-50 border border-teal-100 rounded-xl p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-teal-900">Order Fulfillment</h4>
              <p className="text-xs text-teal-700 mt-0.5">Select and apply the current shipping status of the order.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`${ui.select} sm:w-60 !py-2`}
              >
                <option value="">Select Status</option>
                {statusOptions.map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </select>
              <button
                onClick={order.status === "Processing refund" || order.status === "Refund Success" ? refundOrderUpdateHandler : orderUpdateHandler}
                className={`${ui.btnPrimary} !py-2 px-6`}
              >
                Save status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;