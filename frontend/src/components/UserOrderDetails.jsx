import React, { useEffect, useState } from "react";
import { BsChatDots } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { ui } from "../styles/theme";
import PageHeader from "./ui/PageHeader";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [rating, setRating] = useState(5);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const data = orders?.find((item) => String(item._id) === String(id));

  useEffect(() => {
    if (user?._id) dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user?._id]);

  const reviewHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${server}/product/create-new-review`,
        { user, rating, comment, productId: selectedItem?._id, orderId: id },
        { withCredentials: true }
      );
      toast.success("Review submitted");
      dispatch(getAllOrdersOfUser(user._id));
      setComment("");
      setRating(5);
      setOpen(false);
    } catch {
      toast.error("Could not submit review");
    }
  };

  const refundHandler = async () => {
    try {
      await axios.put(`${server}/order/order-refund/${id}`, { status: "Processing refund" });
      toast.success("Refund request sent");
      dispatch(getAllOrdersOfUser(user._id));
    } catch {
      toast.error("Refund request failed");
    }
  };

  if (!data) {
    return (
      <div className={`${ui.container} py-16 text-center`}>
        <p className="text-gray-600">Order not found.</p>
        <Link to="/profile" className="text-teal-700 font-medium mt-4 inline-block hover:underline">
          Back to profile
        </Link>
      </div>
    );
  }

  return (
    <div className={`${ui.container} py-10`}>
      <PageHeader
        title="Order details"
        subtitle={`Order #${String(data._id).slice(-8).toUpperCase()} · ${data.createdAt?.slice(0, 10)}`}
      />
      <span className={`${ui.badge} ${ui.badgeGreen} mb-8 inline-block`}>{data.status}</span>

      <div className="space-y-4 mb-10">
        {data.cart?.map((item, index) => (
          <div key={index} className={`${ui.card} ${ui.cardPadding} flex flex-col sm:flex-row gap-4 items-center`}>
            <img
              src={item.images?.[0]?.url || item.images?.[0]}
              alt=""
              className="w-24 h-24 object-cover rounded-lg bg-gray-100"
            />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                ${item.discountPrice} × {item.qty}
              </p>
            </div>
            {!item.isReviewed && data.status === "Delivered" && (
              <button
                type="button"
                onClick={() => {
                  setOpen(true);
                  setSelectedItem(item);
                }}
                className={ui.btnSecondary}
              >
                Write review
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className={`${ui.card} ${ui.cardPadding}`}>
          <h3 className={ui.sectionTitle}>Shipping address</h3>
          <p className="mt-3 text-gray-700">
            {data.shippingAddress?.address1} {data.shippingAddress?.address2}
            <br />
            {data.shippingAddress?.city}, {data.shippingAddress?.country} {data.shippingAddress?.zipCode}
          </p>
          <p className="text-sm text-gray-500 mt-2">Phone: {data.user?.phoneNumber}</p>
        </div>
        <div className={`${ui.card} ${ui.cardPadding}`}>
          <h3 className={ui.sectionTitle}>Payment</h3>
          <p className="mt-3 text-sm text-gray-600">
            Status: <span className="font-medium text-gray-900">{data.paymentInfo?.status || "Pending"}</span>
          </p>
          <p className="text-2xl font-semibold text-teal-800 mt-4">${data.totalPrice}</p>
          <div className="flex flex-wrap gap-3 mt-6">
            {data.status === "Delivered" && (
              <button type="button" onClick={refundHandler} className={ui.btnSecondary}>
                Request refund
              </button>
            )}
            <Link to="/inbox" className={ui.btnPrimary}>
              <BsChatDots className="inline mr-2" />
              Contact seller
            </Link>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className={`${ui.card} ${ui.cardPadding} w-full max-w-lg relative`}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
            >
              <RxCross1 size={18} />
            </button>
            <h2 className={ui.titleSm}>Write a review</h2>
            <p className="text-sm text-gray-600 mt-1">{selectedItem?.name}</p>
            <div className="flex gap-1 my-4 justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <button key={i} type="button" onClick={() => setRating(i)}>
                  <AiFillStar size={28} className={rating >= i ? "text-amber-400" : "text-gray-300"} />
                </button>
              ))}
            </div>
            <label className={ui.label}>Your comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className={ui.textarea}
              placeholder="What did you think of this product?"
            />
            <button type="button" onClick={reviewHandler} className={`${ui.btnPrimary} w-full mt-4`}>
              Submit review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderDetails;
