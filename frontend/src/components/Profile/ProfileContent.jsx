import React, { useState } from "react";
import { backend_url } from "../../server";
import { useSelector } from "react-redux";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";

const ProfileContent = ({ active }) => {
  const { user } = useSelector((state) => state.user);

  const [name, setname] = useState(user?.name || "");
  const [email, setemail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAdress2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full">
      {/* Profile Page */}
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={`${backend_url}${user?.avatar}`}
                alt="Profile"
                className="w-[120px] h-[120px] rounded-full object-cover border-2 border-[#3ad132]"
              />
              <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-5 right-5">
                <AiOutlineCamera />
              </div>
            </div>
          </div>

          <br />
          <br />

          {/* Form */}
          <div className="w-full px-5 mt-6">
            <form
              className="flex w-full flex-wrap"
              onSubmit={handleSubmit}
              aria-required={true}
            >
              <div className="w-full flex pb-3">
                {/* Full Name */}
                <div className="w-[50%]">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    className={`${styles.input} !w-[95%]`}
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="w-[50%] pb-3">
                  <label className="block pb-2">Email</label>
                  <input
                    type="email"
                    required
                    className={`${styles.input} !w-[95%]`}
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full flex pb-3">
                {/* Phone */}
                <div className="w-[50%]">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="number"
                    required
                    className={`${styles.input} !w-[95%]`}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                {/* Zipcode */}
                <div className="w-[50%] pb-3">
                  <label className="block pb-2">Zip Code</label>
                  <input
                    type="number"
                    required
                    className={`${styles.input} !w-[95%]`}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full flex pb-3">
                {/* Address 1 */}
                <div className="w-[50%]">
                  <label className="block pb-2">Address 1</label>
                  <input
                    type="text"
                    required
                    className={`${styles.input} !w-[95%]`}
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                  />
                </div>

                {/* Address 2 */}
                <div className="w-[50%] pb-3">
                  <label className="block pb-2">Address 2</label>
                  <input
                    type="text"
                    required
                    className={`${styles.input} !w-[95%]`}
                    value={address2}
                    onChange={(e) => setAdress2(e.target.value)}
                  />
                </div>
              </div>

              <input
                type="submit"
                value="Update"
                className="w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer"
              />
            </form>
          </div>
        </>
      )}

      {/* Orders Page */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}
    </div>
  );
};

//
// ALL ORDERS TABLE
//
const AllOrders = () => {
  const orders = [
    {
      _id: "6437f3e4f1c2b3a5d6e7f890",
      orderItems: [{ name: "Iphone 14 Pro Max" }],
      totalPrice: 1200,
      orderStatus: "Processing",
    },
  ];

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.row.status === "Delivered" ? "greenColor" : "redColor",
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
      field: "action",
      flex: 1,
      minWidth: 150,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const rows = [];

  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        total: "US$" + item.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
 <div className="pl-8 pt-1">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        autoHeight
        disableRowSelectionOnClick
      />
    </div>

  );
};

export default ProfileContent;
