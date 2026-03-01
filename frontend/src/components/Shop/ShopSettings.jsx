import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import { loadSeller } from "../../redux/actions/seller";
import { toast } from "react-toastify";
import axios from "axios";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState(seller?.name || "");
  const [description, setDescription] = useState(seller?.description || "");
  const [address, setAddress] = useState(seller?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(seller?.phoneNumber || "");
  const [zipCode, setZipcode] = useState(seller?.zipCode || "");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller) {
      setName(seller.name || "");
      setDescription(seller.description || "");
      setAddress(seller.address || "");
      setPhoneNumber(seller.phoneNumber || "");
      setZipcode(seller.zipCode || "");
    }
  }, [seller]);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        try {
          await axios.put(`${server}/shop/update-shop-avatar`, { avatar: reader.result }, { withCredentials: true });
          dispatch(loadSeller());
          toast.success("Shop avatar updated successfully!");
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to update shop avatar");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${server}/shop/update-seller-info`, { name, description, address, phoneNumber, zipCode }, { withCredentials: true });
      toast.success("Shop info updated successfully!");
      dispatch(loadSeller());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update seller info");
    } finally {
      setLoading(false);
    }
  };

  const currentAvatar = avatar || (seller?.avatar?.url ? seller.avatar.url : seller?.avatar);

  return (
    <div className="w-full min-h-screen bg-[#EDE7E3]/50 p-8 md:p-12 font-Inter">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h3 className="text-2xl font-black text-[#16697A] tracking-tighter uppercase italic">Shop Settings</h3>
          <p className="text-[#489FB5] text-xs font-black uppercase tracking-[0.3em] mt-1">Merchant Profile Configuration</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 md:p-12 border border-white shadow-soft animate-in fade-in zoom-in duration-700">
          <form onSubmit={updateHandler} className="space-y-8">

            {/* Shop Identity Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 border-b border-[#16697A]/5 pb-8">
              <div className="relative group">
                <div className="w-48 h-48 rounded-[56px] border-4 border-white shadow-2xl overflow-hidden bg-[#EDE7E3] relative">
                  <img src={currentAvatar} alt="Shop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <label htmlFor="image-upload" className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#16697A] text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-xl hover:bg-[#FFA62B] transition-all transform hover:rotate-12">
                  <AiOutlineCamera size={22} />
                  <input type="file" id="image-upload" className="hidden" onChange={handleImage} accept="image/*" />
                </label>
              </div>

              <div className="flex-1 w-full space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Shop Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-[#EDE7E3]/50 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-bold text-[#16697A] shadow-inner transition-all outline-none" placeholder="Shop Name" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Shop Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-[#EDE7E3]/50 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-bold text-[#16697A] shadow-inner transition-all outline-none resize-none" placeholder="Describe your shop..." />
                </div>
              </div>
            </div>

            {/* Logistics & Contact Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Shop Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full bg-[#EDE7E3]/50 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-bold text-[#16697A] shadow-inner transition-all outline-none" placeholder="Shop Address" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Phone Number</label>
                <input type="number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className="w-full bg-[#EDE7E3]/50 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-bold text-[#16697A] shadow-inner transition-all outline-none" placeholder="Phone Number" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Zip Code</label>
                <input type="number" value={zipCode} onChange={(e) => setZipcode(e.target.value)} required className="w-full bg-[#EDE7E3]/50 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-bold text-[#16697A] shadow-inner transition-all outline-none" placeholder="Zip Code" />
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" disabled={loading} className="w-full h-16 bg-[#16697A] text-white font-black rounded-3xl hover:bg-[#FFA62B] transition-all duration-500 shadow-xl overflow-hidden relative group uppercase tracking-[0.2em] text-sm">
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                {loading ? "Updating..." : "Update Shop"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopSettings;