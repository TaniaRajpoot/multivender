import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Layout/Loader";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllProductsShop } from "../../redux/actions/product";

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [value, setValue] = useState("");
  
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const products = useSelector((state) => state.products?.products || []);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller]);

  useEffect(() => {
    const fetchCoupons = async () => {
      if (!seller?._id) return;
      
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${server}/coupon/get-coupon/${seller._id}`,
          {
            withCredentials: true,
          }
        );
        setCoupons(res.data.couponCodes);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch coupons");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoupons();
  }, [seller]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    
    try {
      await axios.delete(`${server}/coupon/delete-coupon/${id}`, {
        withCredentials: true,
      });
      toast.success("Coupon deleted successfully!");
      setCoupons((prev) => prev.filter((coupon) => coupon._id !== id));
    } catch (err) {
      toast.error("Failed to delete coupon");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate fields
    if (!name || !value) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      console.log("Creating coupon with data:", {
        name,
        minAmount,
        maxAmount,
        selectedProducts: selectedProduct,
        value,
        shopId: seller._id,
      });

      const res = await axios.post(
        `${server}/coupon/create-coupon-code`,
        {
          name,
          minAmount: minAmount || null,
          maxAmount: maxAmount || null,
          selectedProducts: selectedProduct || null,
          value: Number(value),
          shopId: seller._id,
        },
        { withCredentials: true }
      );
      
    
      
      toast.success("Coupon created successfully!");
      setCoupons((prev) => [...prev, res.data.coupon]);
      setOpen(false);
      setName("");
      setMinAmount("");
      setMaxAmount("");
      setSelectedProduct("");
      setValue("");
    } catch (err) {
      console.error("Coupon creation error:", err);
      console.error("Error response:", err.response);
      
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Error creating coupon";
      toast.error(errorMessage);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Coupon Code", minWidth: 180, flex: 1.2 },
    { field: "price", headerName: "Value", minWidth: 100, flex: 0.5 },
    {
      field: "Delete",
      headerName: "",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.id)}>
          <AiOutlineDelete size={20} color="red" />
        </Button>
      ),
    },
  ];

  const rows =
    coupons?.map((item) => ({
      id: item._id,
      name: item.name,
      price: `${item.value}%`,
    })) || [];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full px-4 sm:px-8 pt-4 sm:pt-6 mt-8 bg-white rounded-md shadow-sm">
          <div className="flex justify-end mb-4">
            <button
              className="bg-linear-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-md shadow-md hover:opacity-80 transition duration-200"
              onClick={() => setOpen(true)}
            >
              Create Coupon
            </button>
          </div>

          <div className="overflow-x-auto">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              autoHeight
              className="text-gray-700"
            />
          </div>

          {open && (
            <div className="fixed inset-0 bg-[#00000080] z-20000 flex items-center justify-center">
              <div className="w-[90%] sm:w-[500px] bg-white rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
                >
                  <RxCross1 size={24} />
                </button>

                <h2 className="text-2xl font-semibold text-center mb-6">
                  Create Coupon Code
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col space-y-4 text-gray-700"
                >
                  <div>
                    <label className="block mb-1 font-medium">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter coupon name"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Discount Percentage{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      required
                      placeholder="Enter discount %"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-medium">
                        Min Amount
                      </label>
                      <input
                        type="number"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        placeholder="Min amount"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">
                        Max Amount
                      </label>
                      <input
                        type="number"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        placeholder="Max amount"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Select Product
                    </label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                    >
                      <option value="">Choose product</option>
                      {products && products.length > 0 ? (
                        products.map((i) => (
                          <option value={i.name} key={i._id}>
                            {i.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No products available</option>
                      )}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-linear-to-r from-teal-500 to-teal-600 text-white py-2 rounded-md mt-4 hover:opacity-90 transition"
                  >
                    Create Coupon
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupons;