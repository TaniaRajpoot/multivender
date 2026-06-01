import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useDispatch } from "react-redux";
import { server } from "../../server";
import { toast } from "react-toastify";
import AuthLayout from "../ui/AuthLayout";
import FormField from "../ui/FormField";
import { ui } from "../../styles/theme";

const ShopLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${server}/shop/login-shop`,
        { email, password },
        { withCredentials: true }
      );
      dispatch({ type: "LoadSellerSuccess", payload: data.user });
      toast.success("Welcome to your shop dashboard!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Check your details.");
    }
  };

  return (
    <AuthLayout
      title="Seller sign in"
      subtitle="Manage your products, orders, and store settings."
      footer={
        <>
          New seller?{" "}
          <Link to="/shop-create" className="font-semibold text-teal-700 hover:underline">
            Register your shop
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <FormField label="Email" htmlFor="seller-email">
          <input
            id="seller-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={ui.input}
            placeholder="shop@example.com"
          />
        </FormField>

        <FormField label="Password" htmlFor="seller-password">
          <div className="relative">
            <input
              id="seller-password"
              type={visible ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={ui.input}
              placeholder="Your password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setVisible(!visible)}
            >
              {visible ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
            </button>
          </div>
        </FormField>

        <button type="submit" className={`${ui.btnPrimary} w-full py-3 mt-2`}>
          Sign in to dashboard
        </button>
      </form>
    </AuthLayout>
  );
};

export default ShopLogin;
