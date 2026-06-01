import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlinePlus, AiOutlineGift } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Layout/Loader";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllProductsShop } from "../../redux/actions/product";
import { getAllEventsShop } from "../../redux/actions/event";
import { FiX } from "react-icons/fi";

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
  const products = useSelector((state) => state.product?.products || []);
  const events = useSelector((state) => state.events?.events || []);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllProductsShop(seller._id));
      dispatch(getAllEventsShop(seller._id));
    }
  }, [dispatch, seller]);

  useEffect(() => {
    const fetchCoupons = async () => {
      if (!seller?._id) return;
      setIsLoading(true);
      try {
        const res = await axios.get(`${server}/coupon/get-coupon/${seller._id}`, { withCredentials: true });
        setCoupons(res.data.couponCodes);
      } catch (err) {
        toast.error("Could not load discount codes");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoupons();
  }, [seller]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this discount code?")) return;
    try {
      await axios.delete(`${server}/coupon/delete-coupon/${id}`, { withCredentials: true });
      toast.success("Discount code deleted");
      setCoupons((prev) => prev.filter((coupon) => coupon._id !== id));
    } catch (err) {
      toast.error("Could not delete code");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !value) {
      toast.error("Please enter a code name and discount percentage.");
      return;
    }
    try {
      const res = await axios.post(`${server}/coupon/create-coupon-code`, {
        name,
        minAmount: minAmount || null,
        maxAmount: maxAmount || null,
        selectedProduct: selectedProduct || null,
        value: Number(value),
        shopId: seller._id,
      }, { withCredentials: true });

      toast.success("Privilege code synchronized.");
      setCoupons((prev) => [...prev, res.data.coupon]);
      setOpen(false);
      setName("");
      setMinAmount("");
      setMaxAmount("");
      setSelectedProduct("");
      setValue("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create coupon code");
    }
  };

  const columns = [
    { field: "name", headerName: "Code name", minWidth: 180, flex: 1.2, headerClassName: "grid-header" },
    { field: "price", headerName: "Discount", minWidth: 100, flex: 0.5, headerClassName: "grid-header" },
    {
      field: "Delete",
      headerName: "Remove",
      flex: 0.5,
      sortable: false,
      headerClassName: "grid-header",
      renderCell: (params) => (
        <button onClick={() => handleDelete(params.id)} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300">
          <AiOutlineDelete size={20} />
        </button>
      ),
    },
  ];

  const rows = coupons?.map((item) => ({
    id: item._id,
    name: item.name,
    price: `${item.value}%`,
  })) || [];

  return (
    <div className="p-4 sm:p-6">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Discount codes</h1>
              <p className="text-sm text-gray-600 mt-1">Create codes customers can use at checkout.</p>
            </div>
            <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800">
              <AiOutlinePlus size={18} /> New code
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <DataGrid rows={rows} columns={columns} pageSize={10} disableRowSelectionOnClick autoHeight />
          </div>

          {open && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 relative">
                <button type="button" onClick={() => setOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" aria-label="Close">
                  <RxCross1 size={22} />
                </button>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Create discount code</h2>
                <p className="text-sm text-gray-600 mb-6">Customers enter this code on the checkout page.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormInput label="Code name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. SAVE20" />
                  <FormInput label="Discount (%)" type="number" min="1" max="100" value={value} onChange={(e) => setValue(e.target.value)} required placeholder="20" />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Min order ($)" type="number" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} placeholder="Optional" />
                    <FormInput label="Max order ($)" type="number" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} placeholder="Optional" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Apply to (optional)</label>
                    <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 outline-none">
                      <option value="">All products in your shop</option>
                      {products?.length > 0 && (
                        <optgroup label="Products">
                          {products.map((i) => (
                            <option value={i.name} key={`product-${i._id}`}>{i.name}</option>
                          ))}
                        </optgroup>
                      )}
                      {events?.length > 0 && (
                        <optgroup label="Events">
                          {events.map((i) => (
                            <option value={i.name} key={`event-${i._id}`}>{i.name}</option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Leave empty to allow the code on any item from your shop.</p>
                  </div>
                  <button type="submit" className="w-full rounded-lg bg-teal-700 py-3 text-sm font-semibold text-white hover:bg-teal-800">
                    Save code
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const FormInput = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <input {...props} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 outline-none" />
  </div>
);

export default AllCoupons;