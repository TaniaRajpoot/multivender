// import React, { useEffect, useState } from "react";
// import { AiOutlinePlusCircle } from "react-icons/ai";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { createProduct } from "../../redux/actions/product";
// import { categoriesData } from "../../static/data";
// import { toast } from "react-toastify";

// const CreateProduct = () => {
//   const { seller } = useSelector((state) => state.seller);
//   const { success, error } = useSelector((state) => state.products);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [images, setImages] = useState([]);
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [tags, setTags] = useState("");
//   const [originalPrice, setOriginalPrice] = useState();
//   const [discountPrice, setDiscountPrice] = useState();
//   const [stock, setStock] = useState();

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//     }
//     if (success) {
//       toast.success("Product created successfully!");
//       navigate("/dashboard");
//       window.location.reload();
//     }
//   }, [dispatch, error, success]);

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);

//     setImages([]);

//     files.forEach((file) => {
//       const reader = new FileReader();

//       reader.onload = () => {
//         if (reader.readyState === 2) {
//           setImages((old) => [...old, reader.result]);
//         }
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const newForm = new FormData();

//     images.forEach((image) => {
//       newForm.set("images", image);
//     });
//     newForm.append("name", name);
//     newForm.append("description", description);
//     newForm.append("category", category);
//     newForm.append("tags", tags);
//     newForm.append("originalPrice", originalPrice);
//     newForm.append("discountPrice", discountPrice);
//     newForm.append("stock", stock);
//     newForm.append("shopId", seller._id);
//     dispatch(
//       createProduct({
//         name,
//         description,
//         category,
//         tags,
//         originalPrice,
//         discountPrice,
//         stock,
//         shopId: seller._id,
//         images,
//       })
//     );
//   };

//   return (
//     <div className="w-[90%] 800px:w-[50%] bg-white  shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
//       <h5 className="text-[30px] font-Poppins text-center">Create Product</h5>
//       {/* create product form */}
//       <form onSubmit={handleSubmit}>
//         <br />
//         <div>
//           <label className="pb-2">
//             Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={name}
//             className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Enter your product name..."
//           />
//         </div>
//         <br />
//         <div>
//           <label className="pb-2">
//             Description <span className="text-red-500">*</span>
//           </label>
//           <textarea
//             cols="30"
//             required
//             rows="8"
//             type="text"
//             name="description"
//             value={description}
//             className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Enter your product description..."
//           ></textarea>
//         </div>
//         <br />
//         <div>
//           <label className="pb-2">
//             Category <span className="text-red-500">*</span>
//           </label>
//           <select
//             className="w-full mt-2 border h-[35px] rounded-[5px]"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           >
//             <option value="Choose a category">Choose a category</option>
//             {categoriesData &&
//               categoriesData.map((i) => (
//                 <option value={i.title} key={i.title}>
//                   {i.title}
//                 </option>
//               ))}
//           </select>
//         </div>
//         <br />
//         <div>
//           <label className="pb-2">Tags</label>
//           <input
//             type="text"
//             name="tags"
//             value={tags}
//             className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             onChange={(e) => setTags(e.target.value)}
//             placeholder="Enter your product tags..."
//           />
//         </div>
//         <br />
//         <div>
//           <label className="pb-2">Original Price</label>
//           <input
//             type="number"
//             name="price"
//             value={originalPrice}
//             className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             onChange={(e) => setOriginalPrice(e.target.value)}
//             placeholder="Enter your product price..."
//           />
//         </div>
//         <br />
//         <div>
//           <label className="pb-2">
//             Price (With Discount) <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="number"
//             name="price"
//             value={discountPrice}
//             className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             onChange={(e) => setDiscountPrice(e.target.value)}
//             placeholder="Enter your product price with discount..."
//           />
//         </div>
//         <br />
//         <div>
//           <label className="pb-2">
//             Product Stock <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="number"
//             name="price"
//             value={stock}
//             className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             onChange={(e) => setStock(e.target.value)}
//             placeholder="Enter your product stock..."
//           />
//         </div>
//         <br />
//         <div>
//           <label className="pb-2">
//             Upload Images <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="file"
//             name=""
//             id="upload"
//             className="hidden"
//             multiple
//             onChange={handleImageChange}
//           />
//           <div className="w-full flex items-center flex-wrap">
//             <label htmlFor="upload">
//               <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
//             </label>
//             {images &&
//               images.map((i) => (
//                 <img
//                   src={i}
//                   key={i}
//                   alt=""
//                   className="h-[120px] w-[120px] object-cover m-2"
//                 />
//               ))}
//           </div>
//           <br />
//           <div>
//             <input
//               type="submit"
//               value="Create"
//               className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             />
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateProduct;


import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";

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
      navigate("/dashboard");
      window.location.reload();
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
        setImages((prevImages) => [...prevImages, ...base64Images]);
      })
      .catch((error) => {
        toast.error("Error reading images");
        console.error(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !description || !category || !discountPrice || !stock) {
      toast.error("Please fill all required fields!");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image!");
      return;
    }

    const productData = {
      name,
      description,
      category,
      tags,
      originalPrice: originalPrice || 0,
      discountPrice,
      stock,
      shopId: seller._id,
      images: images, // Array of base64 strings
    };

    dispatch(createProduct(productData));
  };

  return (
    <div className="w-[95%] sm:w-[80%] md:w-[60%] lg:w-[50%] mx-auto my-8 bg-white rounded-xl shadow-md p-5">
      <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-6">
        Create Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name..."
            className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            required
            rows="5"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description..."
            className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 font-medium">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            required
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select a category</option>
            {categoriesData &&
              categoriesData.map((i) => (
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
            placeholder="Enter product tags..."
            className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Prices & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">
              Original Price
            </label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Original price"
              className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Discount Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="Discounted price"
              className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter stock quantity"
            className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="upload"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <div className="flex flex-wrap gap-3 items-center">
            <label htmlFor="upload" className="cursor-pointer">
              <AiOutlinePlusCircle size={30} color="#555" />
            </label>
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-md border border-gray-200"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <input 
            type="submit" 
            value={isLoading ? "Creating..." : "Create Product"}
            disabled={isLoading}
            className="w-full mt-4 bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
          />
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;