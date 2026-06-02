import React, { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";
import { ui } from "../../styles/theme";

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
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className={ui.title}>Create product</h1>
        <p className={ui.subtitle}>Register a new product to your shop inventory.</p>
      </div>

      <form onSubmit={handleSubmit} className={`${ui.card} ${ui.cardPadding} space-y-6`}>
        {/* Identity */}
        <div className="space-y-4">
          <h3 className={ui.sectionTitle}>Product details</h3>
          <div className="grid grid-cols-1 gap-4">
            <FormInput label="Product name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter product name..." />
            <div>
              <label className={ui.label}>Description</label>
              <textarea value={description} required onChange={(e) => setDescription(e.target.value)} rows={4} className={ui.textarea} placeholder="Describe your product in detail..." />
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
            <FormInput label="Tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. fashion, electronics" />
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

        {/* Images */}
        <div className="space-y-4">
          <label className={ui.label}>Product Images</label>
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
            {isLoading ? "Creating product..." : "Create product"}
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

export default CreateProduct;