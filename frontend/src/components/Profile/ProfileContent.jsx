import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineCamera,
  AiOutlineArrowRight,
  AiOutlineDelete,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx"; // Add this
import styles from "../../styles/styles";
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
import { Country, State } from "country-state-city";
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
      toast.success("Profile updated successfully!");
      setPassword("");
      dispatch({ type: "clearUpdateSuccess" });
    }
  }, [updateSuccess, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter your password to confirm changes");
      return;
    }

    dispatch(
      updateUserInfo({
        name,
        email,
        password,
        phoneNumber,
      })
    );
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        setAvatarLoading(true);

        try {
          const { data } = await axios.put(
            `${server}/user/update-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (data.success) {
            toast.success("Avatar updated successfully!");
            // Reload user data to get the new avatar
            dispatch(loadUser());
            setAvatar(null); // Clear preview
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to update avatar");
          setAvatar(null); // Clear preview on error
        } finally {
          setAvatarLoading(false);
        }
      }
    };

    reader.readAsDataURL(file);
  };

  const getAvatarUrl = () => {
    // Show preview of new avatar if exists
    if (avatar) {
      return avatar;
    }
    if (user?.avatar?.url) {
      return user.avatar.url;
    } else if (user?.avatar) {
      return user.avatar;
    }
    return "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";
  };

  return (
    <div className="w-full">
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={getAvatarUrl()}
                alt="Profile"
                className="w-[150px] h-[150px] rounded-full object-cover border-4 border-[#3bc177]"
              />

              <div className="w-[35px] h-[35px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={handleImage}
                  accept="image/*"
                  disabled={avatarLoading}
                />
                <label 
                  htmlFor="image" 
                  className={`cursor-pointer flex items-center justify-center ${avatarLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {avatarLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                  ) : (
                    <AiOutlineCamera size={20} />
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="w-full px-5 mt-8">
            <form onSubmit={handleSubmit}>
              <div className="w-full flex flex-wrap">
                {/* Full Name */}
                <div className="w-full md:w-[50%] pb-3 md:pr-2">
                  <label className="block pb-2 text-[#000000ba]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className={`${styles.input} w-full mb-4 md:mb-0`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div className="w-full md:w-[50%] pb-3 md:pl-2">
                  <label className="block pb-2 text-[#000000ba]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={`${styles.input} w-full mb-4 md:mb-0`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="w-full md:w-[50%] pb-3 md:pr-2">
                  <label className="block pb-2 text-[#000000ba]">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    className={`${styles.input} w-full mb-4 md:mb-0`}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="w-full md:w-[50%] pb-3 md:pl-2">
                  <label className="block pb-2 text-[#000000ba]">
                    Enter your Password
                  </label>
                  <input
                    type="password"
                    className={`${styles.input} w-full mb-4 md:mb-0`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Confirm with your password"
                  />
                </div>
              </div>

              <input
                type="submit"
                value={loading ? "Updating..." : "Update"}
                disabled={loading}
                className={`w-[250px] h-10 border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer hover:bg-[#3a24db] hover:text-white transition-all ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
            </form>
          </div>
        </>
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
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user?._id]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      {orders && orders.length > 0 ? (
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          autoHeight
          disableRowSelectionOnClick
        />
      ) : (
        <div className="w-full flex items-center justify-center h-[200px]">
          <p className="text-lg text-gray-500">No orders found</p>
        </div>
      )}
    </div>
  );
};



const AllRefundOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);
  const eligibleOrders =
    orders && orders.filter((item) => item?.status === "Processing refund");
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });
  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableRowSelectionOnClick
      />
    </div>
  );
};


const Inbox = () => {
  return (
    <div className="w-full px-5">
      <h1 className="text-[25px] font-semibold text-[#000000ba] pb-4">Inbox</h1>
      <p className="text-[#000000ba]">No messages yet.</p>
    </div>
  );
};

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/track/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
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

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    if (newPassword.length < 4) {
      toast.error("Password should be at least 4 characters!");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.put(
        `${server}/user/update-user-password`,
        {
          oldPassword,
          newPassword,
          confirmPassword,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-5">
      <h1 className="text-[25px] font-semibold text-[#000000ba] pb-4">
        Change Password
      </h1>

      <div className="w-full">
        <form onSubmit={handlePasswordChange}>
          <div className="w-full md:w-[50%]">
            {/* Old Password */}
            <div className="w-full pb-3">
              <label className="block pb-2 text-[#000000ba]">Old Password</label>
              <input
                type="password"
                className={`${styles.input} w-full mb-4`}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter your old password"
                required
              />
            </div>

            {/* New Password */}
            <div className="w-full pb-3">
              <label className="block pb-2 text-[#000000ba]">New Password</label>
              <input
                type="password"
                className={`${styles.input} w-full mb-4`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="w-full pb-3">
              <label className="block pb-2 text-[#000000ba]">
                Confirm New Password
              </label>
              <input
                type="password"
                className={`${styles.input} w-full mb-4`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
              />
            </div>

            {/* Submit Button */}
            <input
              type="submit"
              value={loading ? "Updating..." : "Update Password"}
              disabled={loading}
              className={`w-[250px] h-10 border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-4 cursor-pointer hover:bg-[#3a24db] hover:text-white transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState();
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user, successMessage, error } = useSelector((state) => state.user); // ✅ Add successMessage and error
  const dispatch = useDispatch();

  const addressTypeData = [
    { name: "Default" },
    { name: "Home" },
    { name: "Office" },
  ];

  // ✅ Handle success and error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" }); // Clear success message
    }
  }, [error, successMessage, dispatch]);

  const handleDelete = (item) => {
    const id = item._id;
    dispatch(deleteUserAddress(id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      dispatch(
        updateUserAddress({
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType,
        })
      );
      setOpen(false);
      setCountry("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode(null);
      setAddressType("");
    }
  };

  return (
    <div className="w-full px-5">
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center z-50">
          <div className="w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-center text-[25px] font-Poppins">
              Add New Address
            </h1>
            <div className="w-full">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="w-full block p-4">
                  {/* Country */}
                  <div className="w-full pb-2">
                    <label className="block pb-2">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-[95%] border h-10 rounded-[5px] px-2"
                      required
                    >
                      <option value="">Choose your country</option>
                      {Country &&
                        Country.getAllCountries().map((item) => (
                          <option key={item.isoCode} value={item.isoCode}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* City */}
                  <div className="w-full pb-2">
                    <label className="block pb-2">City</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-[95%] border h-10 rounded-[5px] px-2"
                      required
                    >
                      <option value="">Choose your city</option>
                      {State &&
                        State.getStatesOfCountry(country).map((item) => (
                          <option key={item.isoCode} value={item.isoCode}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Address 1 */}
                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 1</label>
                    <input
                      type="text"
                      className={`${styles.input}`}
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>

                  {/* Address 2 */}
                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 2</label>
                    <input
                      type="text"
                      className={`${styles.input}`}
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>

                  {/* Zip Code */}
                  <div className="w-full pb-2">
                    <label className="block pb-2">Zip Code</label>
                    <input
                      type="number"
                      className={`${styles.input}`}
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>

                  {/* Address Type */}
                  <div className="w-full pb-2">
                    <label className="block pb-2">Address Type</label>
                    <select
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="w-[95%] border h-10 rounded-[5px] px-2"
                      required
                    >
                      <option value="">Choose your Address Type</option>
                      {addressTypeData.map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit */}
                  <div className="w-full pb-2">
                    <input
                      type="submit"
                      value="Submit"
                      className={`${styles.input} mt-5 cursor-pointer hover:bg-[#3a24db] hover:text-white`}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-semibold text-[#000000] pb-2">
          My Addresses
        </h1>
        <div
          className={`${styles.button} rounded-md cursor-pointer`}
          onClick={() => setOpen(true)}
        >
          <span className="text-white">Add New</span>
        </div>
      </div>

      <br />

      {user && user.addresses && user.addresses.length > 0 ? (
        user.addresses.map((item, index) => (
          <div
            className="w-full bg-white h-[70px] rounded-sm flex items-center px-3 shadow-sm justify-between pr-10 mb-4"
            key={index}
          >
            <div className="flex items-center min-w-[20%]">
              <h5 className="pl-5 font-semibold">{item.addressType}</h5>
            </div>
            <div className="pl-8 flex items-center min-w-[50%]">
              <h6>
                {item.address1} {item.address2}
              </h6>
            </div>
            <div className="pl-8 flex items-center min-w-[15%]">
              <h6>{user.phoneNumber || "N/A"}</h6>
            </div>
            <div className="min-w-[10%] flex justify-end pl-8">
              <AiOutlineDelete
                size={25}
                className="cursor-pointer text-red-500 hover:text-red-700"
                onClick={() => handleDelete(item)}
              />
            </div>
          </div>
        ))
      ) : (
        <h5 className="text-center pt-8 text-[18px]">
          You don't have any saved addresses!
        </h5>
      )}
    </div>
  );
};

export default ProfileContent;