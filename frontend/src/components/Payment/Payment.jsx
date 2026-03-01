import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import CheckoutSteps from "../Checkout/CheckoutSteps";

const Payment = () => {
  const [orderData, setOrderData] = useState(null);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedOrderData = localStorage.getItem("latestOrder");
    if (storedOrderData) {
      setOrderData(JSON.parse(storedOrderData));
    } else {
      navigate("/cart");
    }
  }, [navigate]);

  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100),
  };

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user,
    totalPrice: orderData?.totalPrice,
  };

  const paymentHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(`${server}/payment/process`, paymentData, config);
      const client_secret = data?.client_secret;

      if (!stripe || !elements) {
        toast.error("Stripe is not initialized");
        return;
      }

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: { card: elements.getElement(CardNumberElement) },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          const orderWithPayment = {
            ...order,
            paymentInfo: { id: result.paymentIntent.id, status: result.paymentIntent.status, type: "Credit Card" },
          };
          await axios.post(`${server}/order/create-order`, orderWithPayment, config);
          localStorage.setItem("cartItems", JSON.stringify([]));
          localStorage.setItem("latestOrder", JSON.stringify([]));
          navigate("/order/success");
          toast.success("Order Placed Successfully!");
          setTimeout(() => window.location.reload(), 1000);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();
    const config = { headers: { "Content-Type": "application/json" } };
    const orderWithPayment = { ...order, paymentInfo: { type: "Cash On Delivery" } };

    try {
      await axios.post(`${server}/order/create-order`, orderWithPayment, config);
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      navigate("/order/success");
      toast.success("Order Placed Successfully!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    }
  };

  if (!orderData) return null;

  return (
    <div className="w-full min-h-screen bg-[#EDE7E3] pb-20">
      <CheckoutSteps active={2} />
      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24">
        <div className="flex flex-col lg:flex-row gap-12 mt-8">
          <div className="w-full lg:w-[65%]">
            <PaymentInfo
              user={user}
              paymentHandler={paymentHandler}
              cashOnDeliveryHandler={cashOnDeliveryHandler}
            />
          </div>
          <div className="w-full lg:w-[35%]">
            <CartData orderData={orderData} />
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({ user, paymentHandler, cashOnDeliveryHandler }) => {
  const [select, setSelect] = useState(1);

  const inputStyle = {
    base: {
      fontSize: "18px",
      color: "#16697A",
      fontWeight: "700",
      letterSpacing: "0.025em",
      "::placeholder": { color: "#9CA3AF", fontWeight: "400" },
    },
    invalid: { color: "#ef4444" },
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 md:p-12 border border-white shadow-soft">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-10 h-10 bg-[#16697A] rounded-xl flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>
        <h2 className="text-2xl font-[700] text-[#16697A] tracking-tight font-display italic">Payment Method</h2>
      </div>

      <div className="space-y-6">
        {/* Credit/Debit Card Selection */}
        <div
          onClick={() => setSelect(1)}
          className={`p-8 rounded-[32px] border-2 transition-all cursor-pointer relative overflow-hidden group ${select === 1 ? "bg-white border-[#16697A] shadow-xl" : "bg-[#EDE7E3]/30 border-transparent hover:bg-white/50"
            }`}
        >
          <div className="flex items-center gap-4 relative z-10">
            <div className={`w-6 h-6 rounded-full border-4 transition-all ${select === 1 ? "border-[#16697A] bg-[#FFA62B]" : "border-[#16697A]/20"
              }`} />
            <h4 className="text-[17px] font-[700] text-[#16697A] font-sans">Pay with Debit/Credit Card</h4>
          </div>

          {select === 1 && (
            <div className="mt-10 space-y-8 animate-in fade-in slide-in-from-top duration-500">
              <div className="space-y-2">
                <label className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-[0.2em] ml-1 font-sans">Name on Card</label>
                <input readOnly value={user?.name} className="w-full bg-[#EDE7E3]/30 border border-transparent rounded-2xl px-6 py-4 font-[500] text-[#16697A] shadow-inner font-sans" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-[0.2em] ml-1 font-sans">Exp Date</label>
                  <div className="bg-[#EDE7E3]/50 border border-transparent rounded-2xl px-6 py-4 shadow-inner"><CardExpiryElement options={{ style: inputStyle }} /></div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-[0.2em] ml-1 font-sans">CVC</label>
                  <div className="bg-[#EDE7E3]/50 border border-transparent rounded-2xl px-6 py-4 shadow-inner"><CardCvcElement options={{ style: inputStyle }} /></div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-[0.2em] ml-1 font-sans">Card Number</label>
                <div className="bg-[#EDE7E3]/50 border border-transparent rounded-2xl px-6 py-4 shadow-inner"><CardNumberElement options={{ style: inputStyle }} /></div>
              </div>

              <button onClick={paymentHandler} className="w-full h-20 bg-[#16697A] text-[#EDE7E3] font-[700] uppercase tracking-widest text-[13px] rounded-3xl hover:bg-[#FFA62B] transition-all duration-500 shadow-xl transform hover:-translate-y-1 font-sans">
                Submit Payment
              </button>
            </div>
          )}
        </div>

        {/* Cash on Delivery Selection */}
        <div
          onClick={() => setSelect(2)}
          className={`p-8 rounded-[32px] border-2 transition-all cursor-pointer relative overflow-hidden group ${select === 2 ? "bg-white border-[#16697A] shadow-xl" : "bg-[#EDE7E3]/30 border-transparent hover:bg-white/50"
            }`}
        >
          <div className="flex items-center gap-4 relative z-10">
            <div className={`w-6 h-6 rounded-full border-4 transition-all ${select === 2 ? "border-[#16697A] bg-[#FFA62B]" : "border-[#16697A]/20"
              }`} />
            <h4 className="text-[17px] font-[700] text-[#16697A] font-sans">Cash on Delivery</h4>
          </div>

          {select === 2 && (
            <div className="mt-10 animate-in fade-in slide-in-from-top duration-500">
              <button onClick={cashOnDeliveryHandler} className="w-full h-20 bg-[#16697A] text-white font-[700] uppercase tracking-widest text-[13px] rounded-3xl hover:bg-[#FFA62B] transition-all duration-500 shadow-xl transform hover:-translate-y-1 font-sans">
                Confirm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 md:p-10 border border-white shadow-soft sticky top-8">
      <h3 className="text-xl font-[700] text-[#16697A] mb-8 tracking-tight font-display italic">Order Summary</h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-[10px] font-[700] text-[#6B7280] uppercase tracking-[0.2em] font-sans">
          <span>Subtotal</span>
          <span className="text-[#16697A] text-lg font-[700] font-sans">${orderData?.subTotalPrice?.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-[10px] font-[700] text-[#6B7280] uppercase tracking-[0.2em] font-sans">
          <span>Shipping</span>
          <span className="text-[#16697A] text-lg font-[700] font-sans">${orderData?.shipping?.toFixed(2)}</span>
        </div>

        {orderData?.discountPrice > 0 && (
          <div className="flex justify-between items-center text-[10px] font-[700] text-[#6B7280] uppercase tracking-[0.2em] font-sans">
            <span>Discount</span>
            <span className="text-green-600 text-lg font-[700] font-sans">-${orderData.discountPrice.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-6 border-t border-[#16697A]/10 mt-6 font-sans">
          <span className="text-[12px] font-[700] text-[#16697A] uppercase tracking-[0.2em]">Total</span>
          <span className="text-3xl font-[700] text-[#16697A] tracking-tighter font-display italic">${orderData?.totalPrice}</span>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-[#16697A]/10 text-center">
        <p className="text-[10px] font-[700] text-[#9CA3AF] uppercase tracking-[0.3em] mb-4 font-sans">Secured by Stripe</p>
        <div className="flex justify-center gap-4 opacity-40">
          {/* icons... */}
        </div>
      </div>
    </div>
  );
};

export default Payment;