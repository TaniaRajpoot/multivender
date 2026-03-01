import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCamera } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios"
import { server } from '../../server';
import { toast } from 'react-toastify';
import { RxAvatar } from 'react-icons/rx';

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
      const res = await axios.post(`${server}/shop/create-shop`, shopData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Shop created successfully!");
      navigate("/shop-login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className='min-h-screen bg-[#EDE7E3] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-Inter'>
      {/* Abstract Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#16697A]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#FFA62B]/5 rounded-full blur-[100px]" />

      <div className='w-full max-w-4xl bg-white/40 backdrop-blur-2xl rounded-[48px] shadow-2xl border border-white p-8 md:p-16 relative z-10 flex flex-col md:flex-row gap-12 animate-in fade-in zoom-in duration-700'>

        {/* Left Column: Branding & Value Prop */}
        <div className="md:w-[40%] space-y-8">
          <div>
            <h1 className="text-2xl font-[700] text-[#16697A] tracking-tight leading-tight font-display italic">Register as a seller</h1>
          </div>

          <div className="space-y-6">
            <BenefitItem title="Global Delivery" desc="Access our wide delivery network." />
            <BenefitItem title="Shop Analytics" desc="Insights into your shop's performance." />
            <BenefitItem title="Easy Management" desc="Simple interface to manage products." />
          </div>

          <div className="pt-8">
            <p className="text-sm font-[500] text-[#6B7280] font-sans">Already have an account?</p>
            <Link to="/shop-login" className="text-sm font-[700] text-[#16697A] hover:text-[#FFA62B] transition-colors font-sans mt-2 inline-block">
              Log in
            </Link>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="flex-1">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex flex-col items-center mb-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[40px] border-4 border-white shadow-xl overflow-hidden bg-[#EDE7E3] flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <RxAvatar className="text-[#16697A]/20" size={64} />
                    )}
                  </div>
                  <label htmlFor="file-input" className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#16697A] text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#FFA62B] transition-all transform hover:rotate-12">
                    <AiOutlineCamera size={20} />
                    <input type="file" id="file-input" className="hidden" onChange={handleInputChange} accept="image/*" />
                  </label>
                </div>
                <p className="text-[10px] font-[700] text-[#16697A] uppercase tracking-widest mt-4 font-sans">Shop Logo</p>
              </div>

              <FormInput label="Shop Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter your shop name" />
              <FormInput label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
              <FormInput label="Phone Number" type="number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required placeholder="Enter your phone number" />
              <FormInput label="Address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Enter your address" />
              <FormInput label="Zip Code" type="number" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required placeholder="Enter your zip code" />

              <div className="relative">
                <FormInput label="Password" type={visible ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min 8 characters" />
                <div className="absolute right-4 bottom-4 text-[#16697A]/40 cursor-pointer" onClick={() => setVisible(!visible)}>
                  {visible ? <AiOutlineEye size={24} /> : <AiOutlineEyeInvisible size={24} />}
                </div>
              </div>
            </div>

            <button type="submit" className="w-full h-16 bg-[#16697A] text-[#EDE7E3] font-[700] uppercase tracking-[0.2em] text-[13px] rounded-3xl hover:bg-[#FFA62B] transition-all duration-500 shadow-xl font-sans">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const BenefitItem = ({ title, desc }) => (
  <div className="flex gap-4">
    <div className="w-1.5 h-12 bg-[#FFA62B] rounded-full" />
    <div>
      <h4 className="text-sm font-black text-[#16697A] uppercase tracking-widest">{title}</h4>
      <p className="text-xs font-medium text-[#6B7280] mt-1">{desc}</p>
    </div>
  </div>
)

const FormInput = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className='text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1 font-sans'>{label}</label>
    <input {...props} className='w-full bg-[#EDE7E3]/60 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-[500] text-[#16697A] shadow-inner transition-all outline-none placeholder:text-[#16697A]/20 font-sans' />
  </div>
)

export default ShopCreate