import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { RxAvatar, RxCamera } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import AuthLayout from "../ui/AuthLayout";
import FormField from "../ui/FormField";
import { ui } from "../../styles/theme";

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
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatar) {
      toast.error("Please add a profile photo");
      return;
    }
    try {
      const res = await axios.post(`${server}/user/create-user`, { name, email, password, avatar }, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success(res.data.message || "Check your email to activate your account");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join us to shop and track your orders."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-teal-700 hover:underline">Sign in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
              {avatarPreview ? (
                <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <RxAvatar size={48} />
                </div>
              )}
            </div>
            <label htmlFor="file-input" className="absolute bottom-0 right-0 w-8 h-8 bg-teal-700 text-white rounded-full flex items-center justify-center cursor-pointer">
              <RxCamera size={16} />
            </label>
            <input type="file" id="file-input" accept=".jpg,.jpeg,.png" onChange={handleInputChange} className="sr-only" required />
          </div>
          <p className="text-xs text-gray-500 mt-2">Profile photo required</p>
        </div>

        <FormField label="Full name" htmlFor="name">
          <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className={ui.input} placeholder="Your name" />
        </FormField>
        <FormField label="Email" htmlFor="email">
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={ui.input} placeholder="you@example.com" />
        </FormField>
        <FormField label="Password" htmlFor="password">
          <div className="relative">
            <input id="password" type={visible ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className={ui.input} placeholder="Choose a password" />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" onClick={() => setVisible(!visible)}>
              {visible ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
            </button>
          </div>
        </FormField>

        <label className="flex items-start gap-2 mb-6 text-sm text-gray-600">
          <input type="checkbox" required className="mt-1 rounded border-gray-300" />
          I agree to the terms and conditions
        </label>

        <button type="submit" className={`${ui.btnPrimary} w-full py-3`}>Create account</button>
      </form>
    </AuthLayout>
  );
};

export default Signup;
