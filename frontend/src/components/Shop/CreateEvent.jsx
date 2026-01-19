import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";

import { createEvent } from "../../redux/actions/event";

const CreateEvent = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.events);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]); // Now stores base64 strings
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();
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
      toast.success("Event created successfully!");
      navigate("/dashboard-events");
    }
  }, [dispatch, error, success, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Convert files to base64
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
        setImages(base64Images); // Store base64 strings
      })
      .catch((error) => {
        toast.error("Error reading images");
        console.error(error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !category || !discountPrice || !stock) {
      toast.error("Please fill all required fields!");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select start and end dates!");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image!");
      return;
    }

    const eventData = {
      name,
      description,
      category,
      tags,
      originalPrice: originalPrice || 0,
      discountPrice,
      stock,
      shopId: seller._id,
      start_Date: startDate.toISOString(),
      Finish_Date: endDate.toISOString(),
      images: images, // Array of base64 strings
    };

    dispatch(createEvent(eventData));
  };

  return (
    <div className="w-[95%] md:w-[70%] lg:w-[50%] mx-auto bg-white shadow-md rounded-lg p-5 sm:p-8 mt-5 overflow-y-auto max-h-[85vh]">
      <h5 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-6">
        Create Event
      </h5>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter event name..."
            className="w-full mt-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter event description..."
            className="w-full mt-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 font-medium">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Choose a category</option>
            {categoriesData.map((i) => (
              <option key={i.title} value={i.title}>
                {i.title}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-gray-700 font-medium">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter event tags..."
            className="w-full mt-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Prices */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">
              Original Price
            </label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Original price"
              className="w-full mt-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Discount Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="Discounted price"
              className="w-full mt-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-gray-700 font-medium">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter available stock"
            className="w-full mt-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Dates */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">
              Event Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={startDate ? startDate.toISOString().slice(0, 10) : ""}
              onChange={handleStartDateChange}
              min={today}
              className="w-full mt-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Event End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={endDate ? endDate.toISOString().slice(0, 10) : ""}
              onChange={handleEndDateChange}
              min={minEndDate}
              className="w-full mt-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Upload Images */}
        <div>
          <label className="block text-gray-700 font-medium">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="upload"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <label htmlFor="upload" className="cursor-pointer">
              <AiOutlinePlusCircle size={32} color="#555" />
            </label>
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Event ${index + 1}`}
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-all"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;