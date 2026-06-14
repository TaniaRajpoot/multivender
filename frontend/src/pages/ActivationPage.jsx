import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import AuthLayout from "../components/ui/AuthLayout";
import { ui } from "../styles/theme";
import { server } from "../server";

const ActivationPage = () => {
  const { activationToken } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activationToken) return;
    const activate = async () => {
      try {
        await axios.post(`${server}/user/activation`, { activationToken });
        setError(false);
      } catch (err) {
        console.log(err.response?.data?.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    activate();
  }, [activationToken]);

  return (
    <AuthLayout
      title={loading ? "Activating account…" : error ? "Activation failed" : "Account activated"}
      subtitle={
        loading
          ? "Please wait a moment."
          : error
            ? "This link may have expired. Sign up again or contact support."
            : "Your account is ready. You can sign in and start shopping."
      }
      footer={
        !loading && (
          <Link to={error ? "/sign-up" : "/login"} className="text-teal-700 font-medium hover:underline">
            {error ? "Create a new account" : "Go to sign in"}
          </Link>
        )
      }
    >
      <div className="flex flex-col items-center py-6">
        {loading ? (
          <div className="w-10 h-10 border-4 border-gray-200 border-t-teal-700 rounded-full animate-spin" />
        ) : error ? (
          <span className="text-4xl">⚠️</span>
        ) : (
          <span className="text-4xl">✓</span>
        )}
        {!loading && !error && (
          <Link to="/login" className={`${ui.btnPrimary} mt-6 w-full`}>
            Sign in
          </Link>
        )}
      </div>
    </AuthLayout>
  );
};

export default ActivationPage;
