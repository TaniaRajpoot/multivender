import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCamera } from "react-icons/ai";
import { loadSeller } from "../../redux/actions/seller";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";
import { ui } from "../../styles/theme";
import PageHeader from "../ui/PageHeader";

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
          toast.success("Shop photo updated");
        } catch (error) {
          toast.error(error.response?.data?.message || "Could not update photo");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `${server}/shop/update-seller-info`,
        { name, description, address, phoneNumber, zipCode },
        { withCredentials: true }
      );
      toast.success("Shop info saved");
      dispatch(loadSeller());
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save");
    } finally {
      setLoading(false);
    }
  };

  const currentAvatar = avatar || seller?.avatar?.url || seller?.avatar;

  return (
    <div className="max-w-2xl">
      <PageHeader title="Shop settings" subtitle="Update your shop name, description, and contact details." />
      <form onSubmit={updateHandler} className={`${ui.card} ${ui.cardPadding} space-y-6`}>
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="relative shrink-0">
            <img src={currentAvatar} alt="Shop" className="w-28 h-28 rounded-xl object-cover border border-gray-200" />
            <label
              htmlFor="image-upload"
              className="absolute -bottom-1 -right-1 w-9 h-9 bg-teal-700 text-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-teal-800"
            >
              <AiOutlineCamera size={18} />
              <input type="file" id="image-upload" className="hidden" onChange={handleImage} accept="image/*" />
            </label>
          </div>
          <div className="flex-1 w-full space-y-4">
            <div>
              <label className={ui.label}>Shop name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={ui.input} />
            </div>
            <div>
              <label className={ui.label}>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={ui.textarea} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={ui.label}>Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required className={ui.input} />
          </div>
          <div>
            <label className={ui.label}>Phone</label>
            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className={ui.input} />
          </div>
          <div>
            <label className={ui.label}>Zip code</label>
            <input type="text" value={zipCode} onChange={(e) => setZipcode(e.target.value)} required className={ui.input} />
          </div>
        </div>
        <button type="submit" disabled={loading} className={`${ui.btnPrimary} w-full sm:w-auto`}>
          {loading ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
};

export default ShopSettings;
