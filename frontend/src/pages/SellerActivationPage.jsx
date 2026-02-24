import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { server } from "../server";

const SellerActivationPage = () => {
  const { activationToken } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (activationToken) {
      console.log("Activation token from URL:", activationToken.substring(0, 30) + "...");
      
      const activateShop = async () => {
        try {
          setLoading(true);
          console.log("Sending activation request to:", `${server}/shop/activation`);
          
const res = await axios.post(`${server}/shop/activation`, {
  activation_token: activationToken, 
});
          console.log("Activation response:", res.data);

          if (res.data.success) {
            setLoading(false);
            setError(false);
            // Redirect to dashboard or login after 2 seconds
            setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
          }
        } catch (err) {
          console.error("Activation failed:");
          console.error("Error response:", err.response?.data);
          console.error("Error message:", err.response?.data?.message);
          
          setError(true);
          setLoading(false);
          
          const message = err.response?.data?.message || "Activation failed";
          setErrorMessage(message);
          
          // Auto redirect based on error type
          if (message.includes("already exists")) {
            setTimeout(() => {
              navigate("/shop-login");
            }, 3000);
          }
        }
      };
      
      activateShop();
    }
  }, [activationToken, navigate]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          width: "90%",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {loading && !error ? (
          <>
            <div
              style={{
                width: "60px",
                height: "60px",
                border: "4px solid #e5e7eb",
                borderTopColor: "#3b82f6",
                borderRadius: "50%",
                margin: "0 auto 20px",
                animation: "spin 1s linear infinite",
              }}
            />
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "10px",
              }}
            >
              Activating Your Shop...
            </h2>
            <p style={{ color: "#6b7280", fontSize: "16px" }}>
              Please wait while we activate your shop account.
            </p>
          </>
        ) : error ? (
          <>
            <div
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#fee2e2",
                borderRadius: "50%",
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                style={{
                  width: "30px",
                  height: "30px",
                  color: "#dc2626",
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "10px",
              }}
            >
              Activation Failed
            </h2>
            <p
              style={{
                color: "#6b7280",
                fontSize: "16px",
                marginBottom: "20px",
              }}
            >
              {errorMessage || "The activation link may have expired or is invalid."}
            </p>
            {errorMessage.includes("expired") && (
              <button
                onClick={() => navigate("/shop-create")}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Register Again
              </button>
            )}
            {errorMessage.includes("already exists") && (
              <button
                onClick={() => navigate("/shop-login")}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Go to Login
              </button>
            )}
          </>
        ) : (
          <>
            <div
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#d1fae5",
                borderRadius: "50%",
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                style={{
                  width: "30px",
                  height: "30px",
                  color: "#059669",
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "10px",
              }}
            >
              Shop Activated Successfully!
            </h2>
            <p style={{ color: "#6b7280", fontSize: "16px" }}>
              Redirecting to dashboard...
            </p>
          </>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default SellerActivationPage;