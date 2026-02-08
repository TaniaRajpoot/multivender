import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { server } from "../../server";

const StripeWrapper = ({ children }) => {
  const [stripeApiKey, setStripeApiKey] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStripeApiKey = async () => {
      try {
const { data } = await axios.get(`${server}/payment/stripeapikey`);
        setStripeApiKey(data.stripeApikey);
      } catch (error) {
        console.error("Error fetching Stripe API key:", error);
      } finally {
        setLoading(false);
      }
    };
    getStripeApiKey();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading payment options...</div>
      </div>
    );
  }

  if (!stripeApiKey) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-red-500">Failed to load payment options. Please refresh the page.</div>
      </div>
    );
  }

  return (
    <Elements stripe={loadStripe(stripeApiKey)}>
      {children}
    </Elements>
  );
};

export default StripeWrapper;