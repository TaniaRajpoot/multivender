import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const ShopLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${server}/shop/login-shop`, { email, password }, { withCredentials: true });
      toast.success("Login Success!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#EDE7E3] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-Inter">
      {/* Background Orbs */}
      <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-[#16697A]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-5%] left-[10%] w-[30%] h-[30%] bg-[#FFA62B]/10 rounded-full blur-[80px]" />

      <div className="w-full max-w-md bg-white/40 backdrop-blur-2xl rounded-[56px] shadow-3xl border border-white p-10 md:p-14 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-[700] text-[#16697A] tracking-tighter font-display italic">Login to your shop</h2>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-[#EDE7E3]/60 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-3xl px-8 py-5 font-[500] text-[#16697A] shadow-inner transition-all outline-none font-sans"
              />
            </div>

            <div className="space-y-1 relative">
              <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1">Password</label>
              <input
                type={visible ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#EDE7E3]/60 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-3xl px-8 py-5 font-[500] text-[#16697A] shadow-inner transition-all outline-none font-sans"
              />
              <div className="absolute right-6 bottom-5 text-[#16697A]/40 cursor-pointer" onClick={() => setVisible(!visible)}>
                {visible ? <AiOutlineEye size={24} /> : <AiOutlineEyeInvisible size={24} />}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-[#16697A]/20 text-[#16697A] focus:ring-[#16697A] transition-all" />
              <span className="text-xs font-[500] text-[#6B7280] group-hover:text-[#16697A] transition-colors font-sans">Remember me</span>
            </label>
            <a href="#" className="text-xs font-[700] text-[#489FB5] hover:text-[#16697A] transition-colors uppercase tracking-widest font-sans">Forgot Password?</a>
          </div>

          <button
            type="submit"
            className="w-full h-16 bg-[#16697A] text-[#EDE7E3] font-[700] uppercase tracking-[0.2em] text-[13px] rounded-3xl hover:bg-[#FFA62B] transition-all duration-500 shadow-xl font-sans"
          >
            Login
          </button>

          <div className="text-center pt-4">
            <p className="text-sm font-[500] text-[#6B7280] font-sans">Not have any account?</p>
            <Link to="/shop-create" className="text-sm font-[700] text-[#16697A] hover:text-[#FFA62B] transition-colors font-sans mt-2 inline-block">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopLogin;
