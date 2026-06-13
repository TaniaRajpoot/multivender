import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCamera } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios"
import { server } from '../../server';
import { toast } from 'react-toastify';
import { RxAvatar } from 'react-icons/rx';
import { ui } from '../../styles/theme';

const ShopCreate = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
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
      toast.error("Please provide a brand identity (Profile Picture)");
      return;
    }
    const shopData = { name, email, password, phoneNumber, address, zipCode, avatar };
    try {
      const { data } = await axios.post(`${server}/shop/create-shop`, shopData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success(data.message);
      navigate("/shop-login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-Inter'>
      <div className='w-full max-w-4xl bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-10 md:p-14 flex flex-col md:flex-row gap-10 animate-in fade-in zoom-in duration-700'>

        {/* Left Column: Branding & Value Prop */}
        <div className="md:w-[35%] space-y-6">
          <div>
            <h1 className="text-xl font-bold text-teal-700">Register as a seller</h1>
            <p className="text-xs text-gray-500 mt-1">Start selling your products on our platform.</p>
          </div>

          <div className="space-y-4">
            <BenefitItem title="Global Delivery" desc="Access our wide delivery network." />
            <BenefitItem title="Shop Analytics" desc="Insights into your shop's performance." />
            <BenefitItem title="Easy Management" desc="Simple interface to manage products." />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">Already have an account?</p>
            <Link to="/shop-login" className="text-sm font-semibold text-teal-700 hover:underline mt-1 inline-block">
              Log in
            </Link>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="flex-1">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <RxAvatar className="text-gray-400" size={48} />
                  )}
                </div>
                <label htmlFor="file-input" className="absolute -bottom-1 -right-1 w-8 h-8 bg-teal-700 text-white rounded-lg flex items-center justify-center cursor-pointer shadow-md hover:bg-teal-800 transition">
                  <AiOutlineCamera size={16} />
                  <input type="file" id="file-input" className="hidden" onChange={handleInputChange} accept="image/*" />
                </label>
              </div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-2">Shop Logo</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Shop Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter shop name" />
              <FormInput label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="shop@example.com" />
              <FormInput label="Phone Number" type="number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required placeholder="e.g. +123456789" />
              <FormInput label="Address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="e.g. 123 Main St" />
              <FormInput label="Zip Code" type="number" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required placeholder="e.g. 10001" />

              <div className="relative">
                <FormInput label="Password" type={visible ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min 8 characters" />
                <button type="button" className="absolute right-3 bottom-3 text-gray-400" onClick={() => setVisible(!visible)}>
                  {visible ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className={`${ui.btnPrimary} w-full mt-4 py-3`}>
              Register shop
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const BenefitItem = ({ title, desc }) => (
  <div className="flex gap-3">
    <div className="w-1 bg-teal-700 rounded-full shrink-0" />
    <div>
      <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">{title}</h4>
      <p className="text-[11px] text-gray-500 mt-0.5">{desc}</p>
    </div>
  </div>
)

const FormInput = ({ label, ...props }) => (
  <div>
    <label className={ui.label}>{label}</label>
    <input {...props} className={ui.input} />
  </div>
)

export default ShopCreate;