import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineCamera,
  AiOutlineArrowRight,
  AiOutlineDelete,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
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
import { ui } from "../../styles/theme";

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
        <div className={`${ui.card} ${ui.cardPadding} animate-in fade-in duration-300`}>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative group">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
                <img src={getAvatarUrl()} alt="User" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {avatarLoading && (
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 w-10 h-10 bg-teal-700 text-white rounded-lg flex items-center justify-center cursor-pointer shadow-md hover:bg-teal-800 transition">
                <AiOutlineCamera size={18} />
                <input type="file" id="avatar-upload" className="hidden" onChange={handleImage} accept="image/*" disabled={avatarLoading} />
              </label>
            </div>

            <div className="flex-1 w-full space-y-6">
              <div>
                <h2 className={ui.titleSm}>Profile Settings</h2>
                <p className={ui.hint}>Manage your account information and preferences</p>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={ui.label}>Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={ui.input} />
                </div>
                <div>
                  <label className={ui.label}>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={ui.input} />
                </div>
                <div>
                  <label className={ui.label}>Phone Number</label>
                  <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={ui.input} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-600 mb-1.5">Enter Password to Save Changes</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Confirm current password" required className="w-full rounded-lg border border-orange-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition" />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button type="submit" disabled={loading} className={ui.btnPrimary}>
                    {loading ? "Updating..." : "Save Changes"}
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
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7,
      renderCell: (params) => (
        <span className="font-mono text-xs font-semibold text-gray-500">
          #{params.value?.slice(-8).toUpperCase()}
        </span>
      )
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.5,
      renderCell: (params) => {
        const isDelivered = params.row.status === "Delivered";
        return (
          <div className="flex items-center gap-1.5 h-full">
            <span className={`${ui.badge} ${isDelivered ? ui.badgeGreen : ui.badgeYellow}`}>
              {params.row.status}
            </span>
          </div>
        );
      }
    },
    {
      field: "itemsQty",
      headerName: "Qty",
      type: "number",
      minWidth: 80,
      flex: 0.3,
      renderCell: (params) => (
        <span className="font-semibold text-gray-800">{params.value}</span>
      )
    },
    {
      field: "total",
      headerName: "Total",
      minWidth: 120,
      flex: 0.5,
      renderCell: (params) => (
        <span className="font-semibold text-gray-800 tabular-nums">{params.value}</span>
      )
    },
    {
      field: "action",
      headerName: "",
      flex: 0.3,
      minWidth: 80,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`} className="flex items-center h-full">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700 hover:bg-teal-700 hover:text-white transition">
            <AiOutlineArrowRight size={16} />
          </div>
        </Link>
      ),
    },
  ];

  const sortedOrders = orders ? [...orders].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    if (dateA === dateB) return String(b._id).localeCompare(String(a._id));
    return dateB - dateA;
  }) : [];

  const rows = sortedOrders.map(item => ({
    id: item._id,
    itemsQty: item.cart.length,
    total: "US$ " + item.totalPrice.toLocaleString(),
    status: item.status,
  })) || [];

  return (
    <div className={`${ui.card} ${ui.cardPadding} animate-in fade-in duration-300`}>
      <div className="mb-6">
        <h3 className={ui.titleSm}>Order History</h3>
        <p className={ui.hint}>Archive of your recent marketplace transactions</p>
      </div>

      <div className={ui.tableWrap}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          autoHeight
          disableRowSelectionOnClick
          disableColumnMenu
          className="border-none"
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#0f766e", // bg-teal-700
              color: "white",
              border: "none",
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "600",
                fontSize: "12px",
                textTransform: "uppercase",
              },
              "& .MuiDataGrid-iconSeparator": { display: "none" }
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f3f4f6",
              fontSize: "13px",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f0fdfa!important",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #f3f4f6",
            }
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
    {
      field: "id",
      headerName: "Refund ID",
      minWidth: 150,
      flex: 0.7,
      renderCell: (params) => (
        <span className="font-mono text-xs font-semibold text-gray-500">
          #{params.value?.slice(-8).toUpperCase()}
        </span>
      )
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.5,
      renderCell: (params) => (
        <div className="flex items-center h-full">
          <span className={`${ui.badge} bg-blue-100 text-blue-800`}>
            {params.row.status}
          </span>
        </div>
      )
    },
    {
      field: "itemsQty",
      headerName: "Qty",
      type: "number",
      minWidth: 80,
      flex: 0.3,
      renderCell: (params) => (
        <span className="font-semibold text-gray-800">{params.value}</span>
      )
    },
    {
      field: "total",
      headerName: "Total",
      minWidth: 120,
      flex: 0.5,
      renderCell: (params) => (
        <span className="font-semibold text-gray-800">{params.value}</span>
      )
    },
    {
      field: "action",
      headerName: "",
      flex: 0.3,
      minWidth: 80,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`} className="flex items-center h-full">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700 hover:bg-teal-700 hover:text-white transition">
            <AiOutlineArrowRight size={16} />
          </div>
        </Link>
      ),
    },
  ];

  const sortedRefundOrders = eligibleOrders ? [...eligibleOrders].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    if (dateA === dateB) return String(b._id).localeCompare(String(a._id));
    return dateB - dateA;
  }) : [];

  const rows = sortedRefundOrders.map(item => ({
    id: item._id,
    itemsQty: item.cart.length,
    total: "US$ " + item.totalPrice.toLocaleString(),
    status: item.status,
  })) || [];

  return (
    <div className={`${ui.card} ${ui.cardPadding} animate-in fade-in duration-300`}>
      <div className="mb-6">
        <h3 className={ui.titleSm}>Refund Requests</h3>
        <p className={ui.hint}>Processed reversals and processing refunds</p>
      </div>

      <div className={ui.tableWrap}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          autoHeight
          disableRowSelectionOnClick
          disableColumnMenu
          className="border-none"
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#0f766e",
              color: "white",
              border: "none",
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "600",
                fontSize: "12px",
                textTransform: "uppercase",
              },
              "& .MuiDataGrid-iconSeparator": { display: "none" }
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f3f4f6",
              fontSize: "13px",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f0fdfa!important",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #f3f4f6",
            }
          }}
        />
      </div>
    </div>
  );
};

const Inbox = () => {
  return (
    <div className={`${ui.card} ${ui.cardPadding} text-center animate-in fade-in duration-300`}>
      <h3 className={ui.titleSm}>Your Inbox</h3>
      <p className={`${ui.hint} mt-2`}>No messages available at this time.</p>
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
        <div className="flex items-center h-full">
          <span className={`${ui.badge} ${ui.badgeYellow}`}>
            {params.row.status}
          </span>
        </div>
      )
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 120, flex: 0.4 },
    {
      field: "action",
      headerName: "Live Tracking",
      flex: 0.4,
      minWidth: 120,
      renderCell: (params) => (
        <Link to={`/user/track/order/${params.id}`} className="flex items-center h-full">
          <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white hover:bg-teal-800 transition">
            <MdTrackChanges size={16} />
          </div>
        </Link>
      ),
    },
  ];

  const sortedTrackOrders = orders ? [...orders].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    if (dateA === dateB) return String(b._id).localeCompare(String(a._id));
    return dateB - dateA;
  }) : [];

  const rows = sortedTrackOrders.map(item => ({
    id: item._id,
    itemsQty: item.cart.length,
    status: item.status,
  })) || [];

  return (
    <div className={`${ui.card} ${ui.cardPadding} animate-in fade-in duration-300`}>
      <div className="mb-6">
        <h3 className={ui.titleSm}>Track Order</h3>
        <p className={ui.hint}>Follow the shipment progress of your orders</p>
      </div>
      <div className={ui.tableWrap}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          autoHeight
          disableRowSelectionOnClick
          className="border-none"
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#0f766e",
              color: "white",
              border: "none",
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "600",
                fontSize: "12px",
                textTransform: "uppercase",
              },
              "& .MuiDataGrid-iconSeparator": { display: "none" }
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f3f4f6",
              fontSize: "13px",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f0fdfa!important",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #f3f4f6",
            }
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
    <div className={`${ui.card} ${ui.cardPadding} animate-in fade-in duration-300`}>
      <div className="mb-6">
        <h3 className={ui.titleSm}>Change Password</h3>
        <p className={ui.hint}>Update your credentials to secure your account</p>
      </div>
      <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
        <div>
          <label className={ui.label}>Current Password</label>
          <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className={ui.input} />
        </div>
        <div>
          <label className={ui.label}>New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className={ui.input} />
        </div>
        <div>
          <label className={ui.label}>Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={ui.input} />
        </div>
        <button type="submit" disabled={loading} className={`${ui.btnPrimary} w-full mt-2`}>
          {loading ? "Updating..." : "Update Password"}
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
  const [zipCode, setZipCode] = useState("");
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
      setOpen(false); setCountry(""); setState(""); setCity(""); setAddress1(""); setAddress2(""); setZipCode(""); setAddressType("");
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={ui.titleSm}>Saved Addresses</h3>
          <p className={ui.hint}>Manage shipping and billing address endpoints</p>
        </div>
        <button onClick={() => setOpen(true)} className={ui.btnPrimary}>
          Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user && user.addresses.map((item, index) => (
          <div key={index} className={`${ui.card} ${ui.cardPadding} hover:shadow-md transition-shadow relative`}>
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className={`${ui.badge} ${ui.badgeGray} mb-2`}>
                  {item.addressType}
                </span>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.address1}</h4>
                <p className="text-xs text-gray-500">{item.city}{item.state ? `, ${item.state}` : ""}, {item.country}</p>
                <p className="text-[10px] text-teal-600 font-semibold mt-1">ZIP: {item.zipCode}</p>
              </div>
              <button onClick={() => handleDelete(item)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center">
                <AiOutlineDelete size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-2xl animate-in zoom-in duration-300 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition"><RxCross1 size={16} /></button>
            <h2 className="text-lg font-bold text-gray-900 mb-6">Add New Address</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={ui.label}>Country</label>
                  <select value={country} onChange={(e) => { setCountry(e.target.value); setState(""); setCity(""); }} required className={ui.select}>
                    <option value="">Select</option>
                    {Country.getAllCountries().map((item) => <option key={item.isoCode} value={item.isoCode}>{item.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={ui.label}>State</label>
                  <select value={state} onChange={(e) => { setState(e.target.value); setCity(""); }} required className={ui.select}>
                    <option value="">Select</option>
                    {State.getStatesOfCountry(country).map((item) => <option key={item.isoCode} value={item.isoCode}>{item.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={ui.label}>City</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)} required className={ui.select}>
                    <option value="">Select</option>
                    {City.getCitiesOfState(country, state).map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={ui.label}>Address Line 1</label>
                <input type="text" value={address1} onChange={(e) => setAddress1(e.target.value)} required className={ui.input} />
              </div>
              <div>
                <label className={ui.label}>Address Line 2</label>
                <input type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} className={ui.input} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={ui.label}>Zip Code</label>
                  <input type="number" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required className={ui.input} />
                </div>
                <div>
                  <label className={ui.label}>Address Type</label>
                  <select value={addressType} onChange={(e) => setAddressType(e.target.value)} required className={ui.select}>
                    <option value="">Select Type</option>
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                  </select>
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" className={`${ui.btnPrimary} w-full`}>
                  Submit Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileContent;