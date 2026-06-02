import React, { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import { createEvent } from "../../redux/actions/event";
import { FiX } from "react-icons/fi";
import { ui } from "../../styles/theme";

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
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className={ui.title}>Create event</h1>
        <p className={ui.subtitle}>Initialize a new time-limited promotional event.</p>
      </div>

      <form onSubmit={handleSubmit} className={`${ui.card} ${ui.cardPadding} space-y-6`}>
        {/* Identity */}
        <div className="space-y-4">
          <h3 className={ui.sectionTitle}>Event identity</h3>
          <div className="grid grid-cols-1 gap-4">
            <FormInput label="Event name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Midnight Cyber Sale" />
            <div>
              <label className={ui.label}>Description</label>
              <textarea value={description} required onChange={(e) => setDescription(e.target.value)} rows={4} className={ui.textarea} placeholder="Describe the details and rules of this campaign..." />
            </div>
          </div>
        </div>

        {/* Classification & Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className={ui.sectionTitle}>Classification</h3>
            <div>
              <label className={ui.label}>Category</label>
              <select value={category} required onChange={(e) => setCategory(e.target.value)} className={ui.select}>
                <option value="">Select Category</option>
                {categoriesData && categoriesData.map((i) => <option key={i.title} value={i.title}>{i.title}</option>)}
              </select>
            </div>
            <FormInput label="Tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. clearance, seasonal" />
          </div>

          <div className="space-y-4">
            <h3 className={ui.sectionTitle}>Pricing & Stock</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Original price ($)" type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="0.00" />
              <FormInput label="Sale price ($)" type="number" value={discountPrice} required onChange={(e) => setDiscountPrice(e.target.value)} placeholder="0.00" />
            </div>
            <FormInput label="Stock units" type="number" value={stock} required onChange={(e) => setStock(e.target.value)} placeholder="Available quantity" />
          </div>
        </div>

        {/* Temporal Window */}
        <div className="space-y-4">
          <h3 className={ui.sectionTitle}>Campaign duration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={ui.label}>Start date</label>
              <input type="date" value={startDate ? startDate.toISOString().slice(0, 10) : ""} onChange={handleStartDateChange} min={today} className={ui.input} />
            </div>
            <div>
              <label className={ui.label}>End date</label>
              <input type="date" value={endDate ? endDate.toISOString().slice(0, 10) : ""} onChange={handleEndDateChange} min={minEndDate} className={ui.input} />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <label className={ui.label}>Event Images</label>
          <div className="flex flex-wrap gap-4">
            <label className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-teal-700 transition bg-gray-50 text-gray-500">
              <AiOutlineCloudUpload size={22} />
              <span className="text-[11px] font-semibold">Upload images</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
            {images.map((img, idx) => (
              <div key={idx} className="relative w-28 h-28 group">
                <img src={img} alt="Preview" className="w-full h-full object-cover rounded-xl border border-gray-200 shadow-sm" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition">
                  <FiX size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-gray-200">
          <button type="submit" disabled={isLoading} className={`${ui.btnPrimary} w-full sm:w-auto`}>
            {isLoading ? "Creating event..." : "Create event"}
          </button>
        </div>
      </form>
    </div>
  );
};

const FormInput = ({ label, ...props }) => (
  <div>
    <label className={ui.label}>{label}</label>
    <input {...props} className={ui.input} />
  </div>
);

export default CreateEvent;