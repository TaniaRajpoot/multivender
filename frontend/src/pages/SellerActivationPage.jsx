import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthLayout from "../components/ui/AuthLayout";
import { ui } from "../styles/theme";
import { server } from "../server";

const SellerActivationPage = () => {
  const { activationToken } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!activationToken) return;
    const activateShop = async () => {
      try {
        const res = await axios.post(
          `${server}/shop/activation`,
          { activation_token: activationToken },
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch({ type: "LoadSellerSuccess", payload: res.data.user });
          setError(false);
          setTimeout(() => navigate("/dashboard"), 2000);
        }
      } catch (err) {
        setError(true);
        const message = err.response?.data?.message || "Activation failed";
        setErrorMessage(message);
        if (message.includes("already exists")) {
          setTimeout(() => navigate("/shop-login"), 3000);
        }
      } finally {
        setLoading(false);
      }
    };
    activateShop();
  }, [activationToken, navigate, dispatch]);

  const title = loading ? "Activating your shop…" : error ? "Activation failed" : "Shop activated";
  const subtitle = loading
    ? "Please wait."
    : error
      ? errorMessage
      : "Redirecting to your dashboard…";

  return (
    <AuthLayout
      title={title}
      subtitle={subtitle}
      footer={
        !loading && (
          <>
            {error && errorMessage.includes("expired") && (
              <Link to="/shop-create" className="text-teal-700 font-medium hover:underline">
                Register again
              </Link>
            )}
            {error && errorMessage.includes("already exists") && (
              <Link to="/shop-login" className="text-teal-700 font-medium hover:underline">
                Go to seller login
              </Link>
            )}
            {!error && (
              <Link to="/dashboard" className="text-teal-700 font-medium hover:underline">
                Open dashboard
              </Link>
            )}
          </>
        )
      }
    >
      <div className="flex justify-center py-8">
        {loading ? (
          <div className="w-10 h-10 border-4 border-gray-200 border-t-teal-700 rounded-full animate-spin" />
        ) : error ? (
          <span className="text-4xl">⚠️</span>
        ) : (
          <span className="text-4xl text-green-600">✓</span>
        )}
      </div>
      {!loading && !error && (
        <Link to="/dashboard" className={`${ui.btnPrimary} w-full block text-center`}>
          Go to dashboard
        </Link>
      )}
    </AuthLayout>
  );
};

export default SellerActivationPage;
