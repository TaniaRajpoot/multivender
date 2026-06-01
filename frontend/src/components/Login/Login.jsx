import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import AuthLayout from "../ui/AuthLayout";
import FormField from "../ui/FormField";
import { ui } from "../../styles/theme";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${server}/user/login-user`,
        { email, password },
        { withCredentials: true }
      );
      toast.success("You are logged in!");
      navigate("/");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Check your email and password.");
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back. Enter your account details below."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/sign-up" className="font-semibold text-teal-700 hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-1">
        <FormField label="Email" htmlFor="email">
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={ui.input}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </FormField>

        <FormField label="Password" htmlFor="password">
          <div className="relative">
            <input
              id="password"
              type={visible ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={ui.input}
              placeholder="Your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setVisible(!visible)}
              aria-label={visible ? "Hide password" : "Show password"}
            >
              {visible ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
            </button>
          </div>
        </FormField>

        <label className="flex items-center gap-2 mb-6 cursor-pointer">
          <input type="checkbox" className="rounded border-gray-300 text-teal-700 focus:ring-teal-600" />
          <span className="text-sm text-gray-600">Remember me on this device</span>
        </label>

        <button type="submit" className={`${ui.btnPrimary} w-full py-3`}>
          Sign in
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
