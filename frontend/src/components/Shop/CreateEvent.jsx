import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import { createEvent } from "../../redux/actions/event";
import { FiX, FiCalendar } from "react-icons/fi";

const CreateEvent = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error, isLoading } = useSelector((state) => state.events);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const today = new Date().toISOString().slice(0, 10);
  const minEndDate = startDate
    ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10)
    : "";

  const handleStartDateChange = (e) => {
    const date = new Date(e.target.value);
    setStartDate(date);
    setEndDate(null);
  };

  const handleEndDateChange = (e) => {
    const date = new Date(e.target.value);
    setEndDate(date);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (success) {
      toast.success("Campaign sequence initialized. Event broadcasted.");
      navigate("/dashboard-events");
      window.location.reload();
    }
  }, [dispatch, error, success, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises)
      .then((base64Images) => {
        setImages((prev) => [...prev, ...base64Images]);
      })
      .catch(() => toast.error("Optics integration failed"));
  };

  const removeImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !category || !discountPrice || !stock || !startDate || !endDate) {
      toast.error("Incomplete mission parameters.");
      return;
    }
    if (images.length === 0) {
      toast.error("Visual data missing.");
      return;
    }

    const eventData = {
      name, description, category, tags,
      originalPrice: originalPrice || 0,
      discountPrice, stock,
      shopId: seller._id,
      start_Date: startDate.toISOString(),
      Finish_Date: endDate.toISOString(),
      images,
    };
    dispatch(createEvent(eventData));
  };

  return (
    <div className="w-full px-4 md:px-12 py-10 font-Inter bg-[#EDE7E3]/30 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-12">

        <div className="text-center md:text-left">
          <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
            <span className="w-12 h-1.5 bg-[#FFA62B] rounded-full" />
            <p className="text-[10px] font-black text-[#489FB5] uppercase tracking-[0.5em]">Campaign Deployment</p>
          </div>
          <h2 className="text-3xl font-black text-[#16697A] tracking-tighter leading-none italic uppercase">Create Event</h2>
          <p className="text-lg font-medium text-[#6B7280] mt-4 opacity-70">Initialize a strategic time-limited marketplace event</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-2xl rounded-[56px] border border-white shadow-3xl p-10 md:p-16 space-y-10">

          <div className="space-y-6">
            <h3 className="text-sm font-black text-[#16697A] uppercase tracking-[0.4em] border-b border-[#16697A]/5 pb-4">Event Identity</h3>
            <div className="grid grid-cols-1 gap-8">
              <FormInput label="Event Designation" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Midnight Cyber Sale" />
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1">Event Narrative</label>
                <textarea value={description} required onChange={(e) => setDescription(e.target.value)} rows={6} className="w-full bg-[#EDE7E3]/60 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-[32px] px-8 py-6 font-bold text-[#16697A] outline-none shadow-inner resize-none transition-all" placeholder="Detail the strategic objectives of this campaign..." />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-sm font-black text-[#16697A] uppercase tracking-[0.4em] border-b border-[#16697A]/5 pb-4">Classification</h3>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1">Protocol Type</label>
                <select value={category} required onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#EDE7E3]/60 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-bold text-[#16697A] outline-none shadow-inner transition-all appearance-none">
                  <option value="">Select Category</option>
                  {categoriesData && categoriesData.map((i) => <option key={i.title} value={i.title}>{i.title}</option>)}
                </select>
              </div>
              <FormInput label="Event Keywords" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. clearance, seasonal" />
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-black text-[#16697A] uppercase tracking-[0.4em] border-b border-[#16697A]/5 pb-4">Liquidation & Stock</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Base Valuation ($)" type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="0.00" />
                <FormInput label="Campaign Price ($)" type="number" value={discountPrice} required onChange={(e) => setDiscountPrice(e.target.value)} placeholder="0.00" />
              </div>
              <FormInput label="Event Units" type="number" value={stock} required onChange={(e) => setStock(e.target.value)} placeholder="Available quantity" />
            </div>
          </div>

          {/* Temporal Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-[#16697A] uppercase tracking-[0.4em] border-b border-[#16697A]/5 pb-4">Temporal Window (Schedule)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1">Initialization Date</label>
                <input type="date" value={startDate ? startDate.toISOString().slice(0, 10) : ""} onChange={handleStartDateChange} min={today} className="w-full bg-[#EDE7E3]/60 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-bold text-[#16697A] outline-none shadow-inner transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1">Termination Date</label>
                <input type="date" value={endDate ? endDate.toISOString().slice(0, 10) : ""} onChange={handleEndDateChange} min={minEndDate} className="w-full bg-[#EDE7E3]/60 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-bold text-[#16697A] outline-none shadow-inner transition-all" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black text-[#16697A] uppercase tracking-[0.4em] border-b border-[#16697A]/5 pb-4">Campaign Optics</h3>
            <div className="flex flex-wrap gap-4">
              <label className="w-32 h-32 rounded-[32px] bg-[#16697A] text-white flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#FFA62B] transition-all shadow-xl group border-4 border-white">
                <AiOutlineCloudUpload size={24} className="group-hover:translate-y-[-4px] transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-widest text-center px-2 leading-none">Add Optics</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              {images.map((img, idx) => (
                <div key={idx} className="relative w-32 h-32 group animate-in zoom-in duration-300">
                  <img src={img} alt="Preview" className="w-full h-full object-cover rounded-[32px] border-4 border-white shadow-lg" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 text-center">
            <button type="submit" disabled={isLoading} className="w-full md:w-auto px-20 py-6 bg-[#16697A] text-white font-black rounded-[32px] hover:bg-[#FFA62B] transition-all transform hover:scale-105 shadow-2xl uppercase tracking-[0.3em] text-sm disabled:opacity-50">
              {isLoading ? "Broadcasting..." : "Authorize Campaign"}
            </button>
            <p className="text-[10px] font-bold text-[#6B7280] mt-6 uppercase tracking-widest italic opacity-40">* Events are synchronized across all regional relay nodes</p>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormInput = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1">{label}</label>
    <input {...props} className="w-full bg-[#EDE7E3]/60 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-bold text-[#16697A] outline-none shadow-inner transition-all placeholder:text-[#16697A]/20" />
  </div>
);

export default CreateEvent;