
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
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
        <Link to="/dashboard-orders">
          <div className={`${styles.button} bg-[#fce1e6]! rounded-sm! text-[#e94560] font-semibold h-[45px]! text-[18px]`}>
            Order List
          </div>
        </Link>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Order ID: <span>#{order._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Placed on: <span>{order.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      {/* Order Items */}
      <br /><br />
      {order.cart?.map((item, idx) => (
        <div key={idx} className="w-full flex items-start mb-5">
          <img src={item.images[0]?.url} alt="" className="w-20 h-20" />
          <div className="w-full">
            <h5 className="pl-3 text-[20px]">{item.name}</h5>
            <h5 className="pl-3 text-[20px] text-[#00000091]">
              US${item.discountPrice} x {item.qty}
            </h5>
          </div>
        </div>
      ))}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>US${order.totalPrice}</strong>
        </h5>
      </div>

      <br /><br />
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-semibold">Shipping Address:</h4>
          <h4 className="pt-3 text-[20px]">
            {order.shippingAddress.address1} {order.shippingAddress.address2}
          </h4>
          <h4 className="text-[20px]">{order.shippingAddress.country}</h4>
          <h4 className="text-[20px]">{order.shippingAddress.city}</h4>
          <h4 className="text-[20px]">{order.user?.phoneNumber}</h4>
        </div>

        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px]">Payment Info:</h4>
          <h4>Status: {order.paymentInfo?.status || "Not Paid"}</h4>
        </div>
      </div>

      <br /><br />
      <h4 className="pt-3 text-[20px] font-semibold">Order Status:</h4>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
      >
        {statusOptions.map((option, idx) => (
          <option key={idx} value={option}>{option}</option>
        ))}
      </select>

      <div
        className={`${styles.button} mt-5 bg-[#FCE1E6]! rounded-sm! text-[#E94560] font-semibold h-[45px]! text-[18px]`}
        onClick={order.status === "Processing refund" || order.status === "Refund Success" ? refundOrderUpdateHandler : orderUpdateHandler}
      >
        Update Status
      </div>
    </div>
  );
};

export default OrderDetails;