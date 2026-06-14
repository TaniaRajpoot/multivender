import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Layout/Loader";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllProductsShop } from "../../redux/actions/product";
import { getAllEventsShop } from "../../redux/actions/event";
import ListPage from "../ui/ListPage";
import { ui } from "../../styles/theme";

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
        <>
          <ListPage
            title="Discount codes"
            subtitle="Create codes customers can use at checkout."
            action={
              <button
                type="button"
                onClick={() => setOpen(true)}
                className={ui.btnPrimary}
              >
                <AiOutlinePlus size={18} /> New code
              </button>
            }
          >
            <DataGrid rows={rows} columns={columns} pageSize={10} disableRowSelectionOnClick autoHeight />
          </ListPage>

          {open && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 relative">
                <button type="button" onClick={() => setOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" aria-label="Close">
                  <RxCross1 size={22} />
                </button>
                <h2 className={ui.titleSm}>Create discount code</h2>
                <p className="text-sm text-gray-600 mb-6">Customers enter this code on the checkout page.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormInput label="Code name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. SAVE20" />
                  <FormInput label="Discount (%)" type="number" min="1" max="100" value={value} onChange={(e) => setValue(e.target.value)} required placeholder="20" />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Min order ($)" type="number" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} placeholder="Optional" />
                    <FormInput label="Max order ($)" type="number" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} placeholder="Optional" />
                  </div>
                  <div>
                    <label className={ui.label}>Apply to (optional)</label>
                    <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className={ui.select}>
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
                    <p className={ui.hint}>Leave empty to allow the code on any item from your shop.</p>
                  </div>
                  <button type="submit" className={`${ui.btnPrimary} w-full`}>
                    Save code
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const FormInput = ({ label, ...props }) => (
  <div>
    <label className={ui.label}>{label}</label>
    <input {...props} className={ui.input} />
  </div>
);

export default AllCoupons;