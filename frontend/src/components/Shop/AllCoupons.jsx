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
        const res = await axios.get(`${server}/coupon/get-coupon/${seller._id}`, { withCredentials: true });
        setCoupons(res.data.couponCodes);
      } catch (err) {
        toast.error("Failed to fetch privilege codes");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoupons();
  }, [seller]);

  const handleDelete = async (id) => {
    if (!window.confirm("Authorize permanent termination of this privilege code?")) return;
    try {
      await axios.delete(`${server}/coupon/delete-coupon/${id}`, { withCredentials: true });
      toast.success("Privilege code terminated");
      setCoupons((prev) => prev.filter((coupon) => coupon._id !== id));
    } catch (err) {
      toast.error("Termination failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !value) {
      toast.error("Required parameters missing.");
      return;
    }
    try {
      const res = await axios.post(`${server}/coupon/create-coupon-code`, {
        name,
        minAmount: minAmount || null,
        maxAmount: maxAmount || null,
        selectedProducts: selectedProduct || null,
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
      toast.error("Synchronization error.");
    }
  };

  const columns = [
    { field: "id", headerName: "CODE ID", minWidth: 150, flex: 0.7, headerClassName: "grid-header" },
    { field: "name", headerName: "DESIGNATION", minWidth: 180, flex: 1.2, headerClassName: "grid-header" },
    { field: "price", headerName: "DISCOUNT VAL.", minWidth: 100, flex: 0.5, headerClassName: "grid-header" },
    {
      field: "Delete",
      headerName: "PURGE",
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
    <div className="w-full px-4 md:px-12 py-10 font-Inter animate-in fade-in duration-1000">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="max-w-[1600px] mx-auto space-y-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/40 backdrop-blur-xl p-10 rounded-[48px] border border-white shadow-soft">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#16697A] rounded-2xl flex items-center justify-center text-white">
                  <AiOutlineGift size={20} />
                </div>
                <p className="text-[10px] font-black text-[#489FB5] uppercase tracking-[0.4em]">Incentive Architecture</p>
              </div>
              <h1 className="text-2xl font-black text-[#16697A] tracking-tighter italic uppercase">Privilege Codes</h1>
            </div>
            <button onClick={() => setOpen(true)} className="px-8 py-4 bg-[#16697A] text-white font-black rounded-2xl hover:bg-[#FFA62B] transition-all transform hover:scale-105 shadow-xl flex items-center gap-3 uppercase tracking-widest text-[10px]">
              <AiOutlinePlus size={18} /> Generate New Code
            </button>
          </div>

          <div className="bg-white/70 backdrop-blur-2xl rounded-[48px] border border-white shadow-2xl overflow-hidden p-6 md:p-10">
            <style>
              {`
                .grid-header {
                  background-color: transparent !important;
                  color: #16697A !important;
                  font-weight: 900 !important;
                  text-transform: uppercase !important;
                  letter-spacing: 0.1em !important;
                  font-size: 11px !important;
                }
                .MuiDataGrid-root { border: none !important; font-family: 'Inter', sans-serif !important; }
                .MuiDataGrid-cell { border-bottom: 1px solid #EDE7E3 !important; color: #489FB5 !important; font-weight: 700 !important; display: flex !important; align-items: center !important; }
                .MuiDataGrid-columnHeaders { border-bottom: 2px solid #16697A !important; }
                .MuiDataGrid-row:hover { background-color: #EDE7E3 !important; }
              `}
            </style>
            <div className="w-full">
              <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick autoHeight />
            </div>
          </div>

          {open && (
            <div className="fixed inset-0 bg-[#16697A]/20 backdrop-blur-lg z-[10000] flex items-center justify-center p-4">
              <div className="w-full max-w-xl bg-white rounded-[56px] shadow-3xl p-10 md:p-16 relative animate-in zoom-in duration-300">
                <button onClick={() => setOpen(false)} className="absolute top-10 right-10 w-12 h-12 bg-[#EDE7E3] text-[#16697A] rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <RxCross1 size={24} />
                </button>

                <div className="text-center mb-10">
                  <p className="text-[10px] font-black text-[#FFA62B] uppercase tracking-[0.4em] mb-2">New Protocol</p>
                  <h2 className="text-2xl font-black text-[#16697A] tracking-tighter italic uppercase">Code Generation</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <FormInput label="Designation (Name)" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. SUMMER_ELITE_20" />
                  <FormInput label="Discount Magnitude (%)" type="number" value={value} onChange={(e) => setValue(e.target.value)} required placeholder="Magnitude (0-100)" />

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Min Threshold ($)" type="number" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} placeholder="0.00" />
                    <FormInput label="Max Ceiling ($)" type="number" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} placeholder="0.00" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1">Asset Applicability</label>
                    <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="w-full bg-[#EDE7E3]/60 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-bold text-[#16697A] outline-none shadow-inner transition-all appearance-none">
                      <option value="">Choose Applicable Asset</option>
                      {products?.map((i) => <option value={i.name} key={i._id}>{i.name}</option>)}
                    </select>
                  </div>

                  <button type="submit" className="w-full py-6 bg-[#16697A] text-white font-black rounded-[32px] hover:bg-[#FFA62B] transition-all transform hover:scale-105 shadow-2xl uppercase tracking-[0.3em] text-sm md:mt-4">
                    Authorize Synchronization
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
  <div className="space-y-2">
    <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1">{label}</label>
    <input {...props} className="w-full bg-[#EDE7E3]/60 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-bold text-[#16697A] outline-none shadow-inner transition-all placeholder:text-[#16697A]/20" />
  </div>
);

export default AllCoupons;