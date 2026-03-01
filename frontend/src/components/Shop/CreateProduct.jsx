import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { isLoading, success, error } = useSelector((state) => state.product);

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

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (success) {
      toast.success("Product created successfully!");
      navigate("/dashboard-products");
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
        setImages((prevImages) => [...prevImages, ...base64Images]);
      })
      .catch(() => toast.error("Image upload failed"));
  };

  const removeImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !category || !discountPrice || !stock) {
      toast.error("Incomplete data parameters detected.");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload images!");
      return;
    }

    const productData = {
      name, description, category, tags,
      originalPrice: originalPrice || 0,
      discountPrice, stock,
      shopId: seller._id,
      images,
    };
    dispatch(createProduct(productData));
  };

  return (
    <div className="w-full px-4 md:px-12 py-10 font-Inter bg-[#EDE7E3]/30 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-12">

        <div className="text-center md:text-left">
          <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
            <span className="w-12 h-1.5 bg-[#FFA62B] rounded-full" />
            <p className="text-[10px] font-black text-[#489FB5] uppercase tracking-[0.5em]">Inventory</p>
          </div>
          <h2 className="text-3xl font-black text-[#16697A] tracking-tighter leading-none italic uppercase">Create Product</h2>
          <p className="text-lg font-medium text-[#6B7280] mt-2 opacity-70">Register a new product to your shop</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-2xl rounded-[56px] border border-white shadow-3xl p-10 md:p-16 space-y-10">

          {/* Product Details Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-[#16697A] uppercase tracking-[0.4em] border-b border-[#16697A]/5 pb-4">Product Details</h3>
            <div className="grid grid-cols-1 gap-8">
              <FormInput label="Product Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter product name..." />
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1">Product Description</label>
                <textarea value={description} required onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-[#EDE7E3]/60 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-[32px] px-8 py-6 font-bold text-[#16697A] outline-none shadow-inner resize-none transition-all" placeholder="Describe your product..." />
              </div>
            </div>
          </div>

          {/* Classification Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-sm font-black text-[#16697A] uppercase tracking-[0.4em] border-b border-[#16697A]/5 pb-4">Classification</h3>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1">Category</label>
                <select value={category} required onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#EDE7E3]/60 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-bold text-[#16697A] outline-none shadow-inner transition-all appearance-none">
                  <option value="">Select Category</option>
                  {categoriesData && categoriesData.map((i) => <option key={i.title} value={i.title}>{i.title}</option>)}
                </select>
              </div>
              <FormInput label="Product Tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. fashion, electronics..." />
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-black text-[#16697A] uppercase tracking-[0.4em] border-b border-[#16697A]/5 pb-4">Pricing & Stock</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Original Price" type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="0.00" />
                <FormInput label="Discount Price" type="number" value={discountPrice} required onChange={(e) => setDiscountPrice(e.target.value)} placeholder="0.00" />
              </div>
              <FormInput label="Product Stock" type="number" value={stock} required onChange={(e) => setStock(e.target.value)} placeholder="Available quantity" />
            </div>
          </div>

          {/* Optics Section */}
          <div className="space-y-6">
            <label className="w-32 h-32 rounded-[32px] bg-[#16697A] text-white flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#FFA62B] transition-all shadow-xl group border-4 border-white">
              <AiOutlineCloudUpload size={24} className="group-hover:translate-y-[-4px] transition-transform" />
              <span className="text-[9px] font-black uppercase tracking-widest text-center px-2 leading-none">Upload Images</span>
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

          <div className="pt-6 text-center">
            <button type="submit" disabled={isLoading} className="w-full md:w-auto px-20 py-5 bg-[#16697A] text-white font-black rounded-3xl hover:bg-[#FFA62B] transition-all transform hover:scale-105 shadow-2xl uppercase tracking-[0.3em] text-sm disabled:opacity-50">
              {isLoading ? "Creating..." : "Create"}
            </button>
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

export default CreateProduct;