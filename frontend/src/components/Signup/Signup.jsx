import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { RxAvatar, RxCamera } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatar) {
      toast.error("Please upload a profile picture");
      return;
    }
    const config = { headers: { "Content-Type": "application/json" } };
    const userData = { name, email, password, avatar };

    try {
      const res = await axios.post(`${server}/user/create-user`, userData, config);
      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#EDE7E3] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Abstract Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFA62B]/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#16697A]/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-1 bg-[#FFA62B] rounded-full" />
        </div>
        <h2 className="text-2xl font-[700] text-[#16697A] tracking-tight font-display italic">
          Register as a new user
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[500px] relative z-10">
        <div className="bg-white/70 backdrop-blur-xl py-10 px-8 md:px-12 shadow-3xl sm:rounded-[40px] border border-white">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[32px] overflow-hidden bg-[#EDE7E3] border-4 border-white shadow-xl transition-transform duration-500 group-hover:scale-105">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[#16697A]/20">
                      <RxAvatar size={80} />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="file-input"
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#16697A] text-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-[#FFA62B] transition-all duration-300 transform hover:rotate-12"
                >
                  <RxCamera size={20} />
                </label>
                <input type="file" name="avatar" id="file-input" accept=".jpg,.jpeg,.png" onChange={handleInputChange} className="sr-only" required />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-xs font-black text-[#16697A] uppercase tracking-widest mb-3 ml-1">
                  Full Name
                </label>
                <input
                  type="text" name="name" id="name" required value={name} onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-6 py-4 bg-[#EDE7E3]/50 border border-transparent rounded-2xl placeholder-[#9CA3AF] text-[#16697A] font-[500] focus:outline-none focus:ring-1 focus:ring-[#16697A]/20 focus:bg-white transition-all shadow-inner font-sans"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-black text-[#16697A] uppercase tracking-widest mb-3 ml-1">
                  Email Address
                </label>
                <input
                  type="email" name="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-6 py-4 bg-[#EDE7E3]/50 border border-transparent rounded-2xl placeholder-[#9CA3AF] text-[#16697A] font-[500] focus:outline-none focus:ring-1 focus:ring-[#16697A]/20 focus:bg-white transition-all shadow-inner font-sans"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-black text-[#16697A] uppercase tracking-widest mb-3 ml-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={visible ? "text" : "password"} name="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-6 py-4 bg-[#EDE7E3]/50 border border-transparent rounded-2xl placeholder-[#9CA3AF] text-[#16697A] font-[500] focus:outline-none focus:ring-1 focus:ring-[#16697A]/20 focus:bg-white transition-all shadow-inner font-sans"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-6 flex items-center">
                    {visible ? (
                      <AiOutlineEye className="cursor-pointer text-[#489FB5] hover:text-[#16697A] transition-colors" size={22} onClick={() => setVisible(false)} />
                    ) : (
                      <AiOutlineEyeInvisible className="cursor-pointer text-[#489FB5] hover:text-[#16697A] transition-colors" size={22} onClick={() => setVisible(true)} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center group cursor-pointer py-2">
              <input type="checkbox" name="agree-terms" id="agree-terms" className="h-5 w-5 text-[#16697A] focus:ring-[#16697A] border-[#EDE7E3] rounded-lg cursor-pointer" required />
              <label htmlFor="agree-terms" className="ml-3 block text-sm text-[#6B7280] font-bold cursor-pointer transition-colors group-hover:text-[#16697A]">
                I agree to the <span className="text-[#489FB5] underline underline-offset-4">Terms and Conditions</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full h-16 flex justify-center items-center py-4 px-8 bg-[#16697A] text-[#EDE7E3] text-[13px] uppercase tracking-[0.2em] font-[700] rounded-2xl hover:bg-[#FFA62B] transition-all duration-500 shadow-xl font-sans"
            >
              Submit
            </button>

            <div className="pt-6 border-t border-[#EDE7E3] text-center">
              <span className="text-[#6B7280] font-[500] text-sm font-sans">Already have an account?</span>
              <Link to="/login" className="text-[#489FB5] font-[700] hover:text-[#16697A] transition-colors ml-2 border-b-2 border-transparent hover:border-[#16697A] pb-1 font-sans">
                Log In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;