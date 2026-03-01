import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineCamera,
  AiOutlineArrowRight,
  AiOutlineDelete,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import { toast } from "react-toastify";
import {
  updateUserInfo,
  loadUser,
  updateUserAddress,
  deleteUserAddress
} from "../../redux/actions/user.js";
import { clearErrors } from "../../redux/actions/product.js";
import axios from "axios";
import { server } from "../../server";
import { Country, State, City } from "country-state-city";
import { getAllOrdersOfUser } from "../../redux/actions/order.js";

const ProfileContent = ({ active }) => {
  const { user, error, loading, updateSuccess } = useSelector((state) => state.user);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Identity Updated Successfully");
      setPassword("");
      dispatch({ type: "clearUpdateSuccess" });
    }
  }, [updateSuccess, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      toast.error("Authentication required to save changes");
      return;
    }
    dispatch(updateUserInfo({ name, email, password, phoneNumber }));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        setAvatarLoading(true);
        try {
          const { data } = await axios.put(
            `${server}/user/update-avatar`,
            { avatar: reader.result },
            { withCredentials: true, headers: { "Content-Type": "application/json" } }
          );
          if (data.success) {
            toast.success("Avatar Rebranded Successfully");
            dispatch(loadUser());
            setAvatar(null);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Rebranding failed");
          setAvatar(null);
        } finally {
          setAvatarLoading(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const getAvatarUrl = () => {
    if (avatar) return avatar;
    if (user?.avatar?.url) return user.avatar.url;
    if (user?.avatar) return user.avatar;
    return "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";
  };

  return (
    <div className="w-full min-h-[80vh]">
      {active === 1 && (
        <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 md:p-12 border border-white shadow-soft animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[56px] overflow-hidden border-4 border-white shadow-2xl relative">
                <img src={getAvatarUrl()} alt="User" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                {avatarLoading && (
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#16697A] text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-xl hover:bg-[#FFA62B] transition-all transform hover:rotate-12">
                <AiOutlineCamera size={20} />
                <input type="file" id="avatar-upload" className="hidden" onChange={handleImage} accept="image/*" disabled={avatarLoading} />
              </label>
            </div>

            <div className="flex-1 w-full space-y-8">
              <div>
                <h2 className="text-3xl font-[700] text-[#16697A] tracking-tighter font-display italic">Profile</h2>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1 font-sans">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-[#EDE7E3]/50 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-[500] text-[#16697A] shadow-inner transition-all outline-none font-sans" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1 font-sans">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-[#EDE7E3]/50 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-[500] text-[#16697A] shadow-inner transition-all outline-none font-sans" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1 font-sans">Phone Number</label>
                  <input type="number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-[#EDE7E3]/50 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-[500] text-[#16697A] shadow-inner transition-all outline-none font-sans" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#FFA62B] uppercase tracking-[0.2em] ml-1 font-sans">Enter your password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password to save" required className="w-full bg-[#EDE7E3]/50 border border-[#FFA62B]/20 focus:border-[#FFA62B] focus:bg-white rounded-2xl px-6 py-4 font-[500] text-[#16697A] shadow-inner transition-all outline-none font-sans" />
                </div>

                <div className="md:col-span-2 pt-4">
                  <button type="submit" disabled={loading} className="group relative h-16 px-12 bg-[#16697A] text-[#EDE7E3] font-[700] rounded-2xl hover:bg-[#FFA62B] transition-all duration-500 shadow-xl disabled:opacity-50 uppercase tracking-[0.1em] text-[13px] font-sans">
                    {loading ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {active === 2 && <AllOrders />}
      {active === 3 && <AllRefundOrders />}
      {active === 4 && <Inbox />}
      {active === 5 && <TrackOrder />}
      {active === 6 && <ChangePassword />}
      {active === 7 && <Address />}
    </div>
  );
};

const AllOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user?._id]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 200, flex: 0.8 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.6,
      renderCell: (params) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-[600] uppercase tracking-widest font-sans ${params.row.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
          {params.row.status}
        </span>
      )
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 120, flex: 0.4 },
    { field: "total", headerName: "Total", minWidth: 150, flex: 0.6 },
    {
      field: "action",
      headerName: "",
      flex: 0.4,
      minWidth: 120,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`}>
          <div className="w-10 h-10 rounded-xl bg-[#EDE7E3] flex items-center justify-center text-[#16697A] hover:bg-[#16697A] hover:text-white transition-all transform hover:scale-110">
            <AiOutlineArrowRight size={18} />
          </div>
        </Link>
      ),
    },
  ];

  const rows = orders?.map(item => ({
    id: item._id,
    itemsQty: item.cart.length,
    total: "US$ " + item.totalPrice,
    status: item.status,
  })) || [];

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 border border-white shadow-soft animate-in fade-in slide-in-from-right duration-700">
      <div className="flex items-center gap-4 mb-8">
        <h3 className="text-2xl font-[700] text-[#16697A] tracking-tight font-display italic">All Orders</h3>
      </div>
      <div className="data-grid-container custom-scrollbar">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          autoHeight
          disableRowSelectionOnClick
          className="border-none! font-[600] text-[#16697A]! font-sans"
          sx={{
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "#EDE7E3", borderRadius: "16px", border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "1px solid #EDE7E3" },
          }}
        />
      </div>
    </div>
  );
};

const AllRefundOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user?._id]);

  const eligibleOrders = orders?.filter((item) => item?.status === "Processing refund");

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 200, flex: 0.8 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.6,
      renderCell: (params) => (
        <span className="px-3 py-1 rounded-full text-[10px] font-[600] uppercase tracking-widest bg-blue-100 text-blue-700 font-sans">
          {params.row.status}
        </span>
      )
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 120, flex: 0.4 },
    { field: "total", headerName: "Total", minWidth: 150, flex: 0.6 },
    {
      field: "action",
      headerName: "Examine",
      flex: 0.4,
      minWidth: 120,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`}>
          <div className="w-10 h-10 rounded-xl bg-[#EDE7E3] flex items-center justify-center text-[#16697A] hover:bg-[#16697A] hover:text-white transition-all transform hover:scale-110">
            <AiOutlineArrowRight size={18} />
          </div>
        </Link>
      ),
    },
  ];

  const rows = eligibleOrders?.map(item => ({
    id: item._id,
    itemsQty: item.cart.length,
    total: "US$ " + item.totalPrice,
    status: item.status,
  })) || [];

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 border border-white shadow-soft animate-in fade-in slide-in-from-right duration-700">
      <div className="flex items-center gap-4 mb-8">
        <h3 className="text-2xl font-[700] text-[#16697A] tracking-tight font-display italic">All Refund Orders</h3>
      </div>
      <div className="data-grid-container custom-scrollbar">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          autoHeight
          disableRowSelectionOnClick
          className="border-none! font-bold text-[#16697A]!"
          sx={{
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "#EDE7E3", borderRadius: "16px", border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "1px solid #EDE7E3" },
          }}
        />
      </div>
    </div>
  );
};

const Inbox = () => {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-12 text-center border border-white shadow-soft animate-in fade-in slide-in-from-right duration-700">
      <h3 className="text-2xl font-[700] text-[#16697A] mb-2 tracking-tight font-display italic">Inbox</h3>
    </div>
  );
};

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user?._id]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 200, flex: 0.8 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.6,
      renderCell: (params) => (
        <span className="px-3 py-1 rounded-full text-[10px] font-[600] uppercase tracking-widest bg-pacific-blue/10 text-[#16697A] font-sans">
          {params.row.status}
        </span>
      )
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 120, flex: 0.4 },
    {
      field: "action",
      headerName: "Live Tracking",
      flex: 0.4,
      minWidth: 120,
      renderCell: (params) => (
        <Link to={`/user/track/order/${params.id}`}>
          <div className="w-10 h-10 rounded-xl bg-[#16697A] flex items-center justify-center text-white hover:bg-[#FFA62B] transition-all transform hover:rotate-12">
            <MdTrackChanges size={18} />
          </div>
        </Link>
      ),
    },
  ];

  const rows = orders?.map(item => ({
    id: item._id,
    itemsQty: item.cart.length,
    status: item.status,
  })) || [];

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 border border-white shadow-soft animate-in fade-in slide-in-from-right duration-700">
      <div className="flex items-center gap-4 mb-8">
        <h3 className="text-2xl font-[700] text-[#16697A] tracking-tight font-display italic">Track Order</h3>
      </div>
      <div className="data-grid-container custom-scrollbar">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          autoHeight
          disableRowSelectionOnClick
          className="border-none! font-bold text-[#16697A]!"
          sx={{
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "#EDE7E3", borderRadius: "16px", border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "1px solid #EDE7E3" },
          }}
        />
      </div>
    </div>
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error("Sequence mismatch: Passwords do not align"); return; }
    if (newPassword.length < 4) { toast.error("Security risk: Password too short"); return; }
    setLoading(true);
    try {
      const { data } = await axios.put(`${server}/user/update-user-password`, { oldPassword, newPassword, confirmPassword }, { withCredentials: true, headers: { "Content-Type": "application/json" } });
      if (data.success) {
        toast.success("Security Credentials Updated");
        setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Security update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 md:p-12 border border-white shadow-soft animate-in fade-in slide-in-from-right duration-700">
      <div className="flex items-center gap-4 mb-10">
        <h3 className="text-2xl font-[700] text-[#16697A] tracking-tight font-display italic">Change Password</h3>
      </div>
      <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1 font-sans">Enter your old password</label>
          <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className="w-full bg-[#EDE7E3]/50 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-[500] text-[#16697A] shadow-inner transition-all outline-none font-sans" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1 font-sans">Enter your new password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full bg-[#EDE7E3]/50 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-[500] text-[#16697A] shadow-inner transition-all outline-none font-sans" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1 font-sans">Enter your confirm password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-[#EDE7E3]/50 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-[500] text-[#16697A] shadow-inner transition-all outline-none font-sans" />
        </div>
        <button type="submit" disabled={loading} className="w-full h-16 bg-[#16697A] text-[#EDE7E3] font-[700] rounded-2xl hover:bg-[#FFA62B] transition-all duration-500 shadow-xl disabled:opacity-50 uppercase tracking-widest text-xs font-sans">
          Update Password
        </button>
      </form>
    </div>
  );
};

const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState();
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user, successMessage, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) { toast.error(error); dispatch({ type: "clearErrors" }); }
    if (successMessage) { toast.success("Geography Database Updated"); dispatch({ type: "clearMessages" }); }
  }, [error, successMessage, dispatch]);

  const handleDelete = (item) => {
    const id = item._id;
    dispatch(deleteUserAddress(id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (addressType === "" || country === "" || state === "" || city === "") {
      toast.error("Geolocation data incomplete");
    } else {
      dispatch(updateUserAddress({ country, state, city, address1, address2, zipCode, addressType }));
      setOpen(false); setCountry(""); setState(""); setCity(""); setAddress1(""); setAddress2(""); setZipCode(null); setAddressType("");
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-[700] text-[#16697A] tracking-tight font-display italic">User Address</h3>
        </div>
        <button onClick={() => setOpen(true)} className="px-6 py-3 bg-[#16697A] text-[#EDE7E3] font-[700] rounded-xl hover:bg-[#FFA62B] transition-all shadow-lg text-xs uppercase tracking-widest font-sans">
          Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user && user.addresses.map((item, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-xl rounded-[32px] p-6 border border-white shadow-soft group relative transition-all hover:bg-white">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-1 bg-[#82C0CC]/10 text-[#16697A] text-[10px] font-[600] uppercase tracking-widest rounded-md mb-2 inline-block font-sans">
                  {item.addressType}
                </span>
                <h4 className="text-sm font-[700] text-[#16697A] mb-1 font-sans">{item.address1}</h4>
                <p className="text-xs font-[500] text-[#6B7280] font-sans">{item.city}{item.state ? `, ${item.state}` : ""}, {item.country}</p>
                <p className="text-[10px] font-[600] text-[#489FB5] mt-2 uppercase tracking-widest font-sans">ZIP: {item.zipCode}</p>
              </div>
              <button onClick={() => handleDelete(item)} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform hover:rotate-12">
                <AiOutlineDelete size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-[#0F4D58]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-[40px] p-8 md:p-12 border border-white shadow-2xl animate-in zoom-in duration-300 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setOpen(false)} className="absolute top-8 right-8 text-[#16697A] hover:rotate-90 transition-all p-2 bg-[#EDE7E3] rounded-xl"><RxCross1 size={18} /></button>
            <h2 className="text-2xl font-[700] text-[#16697A] tracking-tighter mb-8 text-center font-display italic">Add New Address</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-widest ml-1 font-sans">Country</label>
                  <select value={country} onChange={(e) => { setCountry(e.target.value); setState(""); setCity(""); }} required className="w-full bg-[#EDE7E3]/50 border border-transparent rounded-2xl px-4 py-3 font-[600] text-sm text-[#16697A] shadow-inner outline-none font-sans appearance-none">
                    <option value="">Select Country</option>
                    {Country.getAllCountries().map((item) => <option key={item.isoCode} value={item.isoCode}>{item.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-widest ml-1 font-sans">State/Province</label>
                  <select value={state} onChange={(e) => { setState(e.target.value); setCity(""); }} required className="w-full bg-[#EDE7E3]/50 border border-transparent rounded-2xl px-4 py-3 font-[600] text-sm text-[#16697A] shadow-inner outline-none font-sans appearance-none">
                    <option value="">Select State</option>
                    {State.getStatesOfCountry(country).map((item) => <option key={item.isoCode} value={item.isoCode}>{item.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-widest ml-1 font-sans">City</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)} required className="w-full bg-[#EDE7E3]/50 border border-transparent rounded-2xl px-4 py-3 font-[600] text-sm text-[#16697A] shadow-inner outline-none font-sans appearance-none">
                    <option value="">Select City</option>
                    {City.getCitiesOfState(country, state).map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-widest ml-1 font-sans">Address 1</label>
                <input type="text" value={address1} onChange={(e) => setAddress1(e.target.value)} required className="w-full bg-[#EDE7E3]/50 border border-transparent rounded-2xl px-6 py-4 font-[600] text-[#16697A] shadow-inner outline-none font-sans" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-widest ml-1 font-sans">Address 2</label>
                <input type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} className="w-full bg-[#EDE7E3]/50 border border-transparent rounded-2xl px-6 py-4 font-[600] text-[#16697A] shadow-inner outline-none font-sans" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-widest ml-1 font-sans">Zip Code</label>
                  <input type="number" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required className="w-full bg-[#EDE7E3]/50 border border-transparent rounded-2xl px-4 py-3 font-[600] text-[#16697A] shadow-inner outline-none font-sans" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-widest ml-1 font-sans">Address Type</label>
                  <select value={addressType} onChange={(e) => setAddressType(e.target.value)} required className="w-full bg-[#EDE7E3]/50 border border-transparent rounded-2xl px-4 py-3 font-[600] text-[#16697A] shadow-inner outline-none font-sans">
                    <option value="">Select Type</option>
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full h-16 bg-[#16697A] text-[#EDE7E3] font-[700] rounded-2xl hover:bg-[#FFA62B] transition-all duration-500 shadow-xl mt-4 uppercase tracking-[0.1em] text-[13px] font-sans">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileContent;