import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import styles from "../../styles/styles";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

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

  // Stripe Payment Handler
  const paymentHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${server}/payment/process`,
        paymentData,
        config
      );

      const client_secret = data?.client_secret;

      if (!stripe || !elements) {
        toast.error("Stripe is not initialized");
        return;
      }

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          const orderWithPayment = {
            ...order,
            paymentInfo: {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
              type: "Credit Card",
            },
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

  // Cash on Delivery Handler
  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const orderWithPayment = {
      ...order,
      paymentInfo: {
        type: "Cash On Delivery",
      },
    };

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

  if (!orderData) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>;
  }

  return (
    <div className="w-full flex flex-col items-center py-8 bg-gray-50">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex gap-5">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            user={user}
            paymentHandler={paymentHandler}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({
  user,
  paymentHandler,
  cashOnDeliveryHandler,
}) => {
  const [select, setSelect] = useState(1);

  return (
    <div className="w-full bg-white rounded-md p-5 pb-8 shadow-sm">
      <h5 className="text-[20px] font-semibold mb-5">Payment Method</h5>
      
      {/* Credit/Debit Card */}
      <div className="mb-5">
        <div className="flex w-full pb-4 border-b mb-3">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center cursor-pointer"
            onClick={() => setSelect(1)}
          >
            {select === 1 && (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            )}
          </div>
          <h4 className="text-[18px] pl-2 font-semibold text-[#000000b1]">
            Pay with Debit/Credit Card
          </h4>
        </div>

        {select === 1 && (
          <div className="w-full pb-5">
            <div className="w-full" onSubmit={paymentHandler} component="form">
              <div className="w-full flex gap-3 pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2 text-sm font-medium">Name On Card</label>
                  <input
                    required
                    placeholder={user?.name}
                    className={`${styles.input} text-[#444]`}
                    value={user?.name || ""}
                    readOnly
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2 text-sm font-medium">Exp Date</label>
                  <CardExpiryElement
                    className={`${styles.input}`}
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          lineHeight: 1.5,
                          color: "#444",
                        },
                        empty: {
                          color: "#3a120a",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#444",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="w-full flex gap-3 pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2 text-sm font-medium">Card Number</label>
                  <CardNumberElement
                    className={`${styles.input} !h-[35px]`}
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          lineHeight: 1.5,
                          color: "#444",
                        },
                        empty: {
                          color: "#3a120a",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#444",
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2 text-sm font-medium">CVV</label>
                  <CardCvcElement
                    className={`${styles.input} !h-[35px]`}
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          lineHeight: 1.5,
                          color: "#444",
                        },
                        empty: {
                          color: "#3a120a",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#444",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <button
                type="submit"
                onClick={paymentHandler}
                className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-semibold w-full`}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cash on Delivery */}
      <div>
        <div className="flex w-full pb-4 border-b mb-3">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center cursor-pointer"
            onClick={() => setSelect(2)}
          >
            {select === 2 && (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            )}
          </div>
          <h4 className="text-[18px] pl-2 font-semibold text-[#000000b1]">
            Cash on Delivery
          </h4>
        </div>

        {select === 2 && (
          <div className="w-full">
            <div className="w-full" onSubmit={cashOnDeliveryHandler} component="form">
              <button
                type="submit"
                onClick={cashOnDeliveryHandler}
                className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-semibold w-full`}
              >
                Confirm Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  const shipping = orderData?.shipping?.toFixed(2);
  return (
    <div className="w-full bg-white rounded-md p-5 pb-8 shadow-sm">
      <h3 className="text-[18px] font-semibold mb-4">Order Summary</h3>
      
      <div className="flex justify-between mb-3">
        <h3 className="text-[16px] font-normal text-gray-600">Subtotal:</h3>
        <h5 className="text-[18px] font-semibold">${orderData?.subTotalPrice?.toFixed(2)}</h5>
      </div>
      
      <div className="flex justify-between mb-3">
        <h3 className="text-[16px] font-normal text-gray-600">Shipping:</h3>
        <h5 className="text-[18px] font-semibold">${shipping}</h5>
      </div>
      
      {orderData?.discountPrice > 0 && (
        <div className="flex justify-between mb-3">
          <h3 className="text-[16px] font-normal text-gray-600">Discount:</h3>
          <h5 className="text-[18px] font-semibold text-green-600">
            -${orderData.discountPrice.toFixed(2)}
          </h5>
        </div>
      )}
      
      <div className="flex justify-between border-t pt-3 mt-3">
        <h3 className="text-[18px] font-semibold">Total:</h3>
        <h5 className="text-[20px] font-bold text-blue-600">
          ${orderData?.totalPrice}
        </h5>
      </div>
    </div>
  );
};

export default Payment;