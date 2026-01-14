import React, { useState } from "react";
import { backend_url } from "../../server";
import { useSelector } from "react-redux";
import {
  AiOutlineCamera,
  AiOutlineArrowRight,
  AiOutlineDelete,
} from "react-icons/ai";
import styles from "../../styles/styles";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";

const ProfileContent = ({ active }) => {
  const { user } = useSelector((state) => state.user);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full">
      {/* ================= PROFILE ================= */}
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={`${backend_url}/${user?.avatar}`}
                alt="Profile"
                className="w-[150px] h-[150px] rounded-full object-cover border-4 border-[#3bc177]"
              />

              <div className="w-[35px] h-[35px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                <AiOutlineCamera size={20} />
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

                {/* Zip Code */}
                <div className="w-full md:w-[50%] pb-3 md:pl-2">
                  <label className="block pb-2 text-[#000000ba]">
                    Zip Code
                  </label>
                  <input
                    type="number"
                    className={`${styles.input} w-full mb-4 md:mb-0`}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>

                {/* Address 1 */}
                <div className="w-full md:w-[50%] pb-3 md:pr-2">
                  <label className="block pb-2 text-[#000000ba]">
                    Address 1
                  </label>
                  <input
                    type="text"
                    className={`${styles.input} w-full mb-4 md:mb-0`}
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                  />
                </div>

                {/* Address 2 */}
                <div className="w-full md:w-[50%] pb-3 md:pl-2">
                  <label className="block pb-2 text-[#000000ba]">
                    Address 2
                  </label>
                  <input
                    type="text"
                    className={`${styles.input} w-full mb-4 md:mb-0`}
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                  />
                </div>
              </div>

              <input
                type="submit"
                value="Update"
                className="w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer hover:bg-[#3a24db] hover:text-white transition-all"
              />
            </form>
          </div>
        </>
      )}

      {/* ================= ORDERS ================= */}
      {active === 2 && <AllOrders />}

      {/* ================= REFUND ORDERS ================= */}
      {active === 3 && <AllRefundOrders />}

      {/* ================= inbox ================= */}
      {active === 4 && <Inbox />}

      {/* ================= TRACK ORDER ================= */}
      {active === 5 && <TrackOrder />}

      {/* ================= PAYMENT METHOD ================= */}
      {active === 6 && <PaymentMethod />}

      {/* ================= ADDRESS ================= */}
      {active === 7 && <Address />}
    </div>
  );
};

/* ===========================================================
   ORDERS TABLE COMPONENTS
=========================================================== */

const AllOrders = () => {
  const orders = [
    {
      _id: "order123",
      orderItems: [{ name: "iPhone 14 Pro Max" }],
      totalPrice: 1200,
      orderStatus: "Processing",
    },
  ];

  const rows = orders.map((o) => ({
    id: o._id,
    itemsQty: o.orderItems.length,
    total: "US$ " + o.totalPrice,
    status: o.orderStatus,
  }));

  const columns = [
    { field: "id", headerName: "Order ID", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      cellClassName: (params) =>
        params.value === "Delivered" ? "greenColor" : "redColor",
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", flex: 1 },
    { field: "total", headerName: "Total", type: "number", flex: 1 },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
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

  return (
    <div className="pl-8 pt-1">
      <DataGrid rows={rows} columns={columns} autoHeight pageSize={10} />
    </div>
  );
};

/* ===========================================================
   REFUND ORDERS
=========================================================== */

const AllRefundOrders = () => {
  const orders = [
    {
      _id: "refund123",
      orderItems: [{ name: "iPhone 14 Pro Max" }],
      totalPrice: 1200,
      orderStatus: "Processing",
    },
  ];

  const rows = orders.map((o) => ({
    id: o._id,
    itemsQty: o.orderItems.length,
    total: "US$ " + o.totalPrice,
    status: o.orderStatus,
  }));

  const columns = [
    { field: "id", headerName: "Order ID", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      cellClassName: (params) =>
        params.value === "Delivered" ? "greenColor" : "redColor",
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", flex: 1 },
    { field: "total", headerName: "Total", type: "number", flex: 1 },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
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

  return (
    <div className="pl-8 pt-1">
      <DataGrid rows={rows} columns={columns} autoHeight pageSize={10} />
    </div>
  );
};

/* ===========================================================
   INBOX COMPONENT
=========================================================== */

const Inbox = () => {
  return (
    <div className="w-full px-5">
      <h1 className="text-[25px] font-semibold text-[#000000ba] pb-4">Inbox</h1>
      <p className="text-[#000000ba]">No messages yet.</p>
    </div>
  );
};

/* ===========================================================
   TRACK ORDER
=========================================================== */

const TrackOrder = () => {
  const orders = [
    {
      _id: "track123",
      orderItems: [{ name: "iPhone 14 Pro Max" }],
      totalPrice: 1200,
      orderStatus: "Processing",
    },
  ];

  const rows = orders.map((o) => ({
    id: o._id,
    itemsQty: o.orderItems.length,
    total: "US$ " + o.totalPrice,
    status: o.orderStatus,
  }));

  const columns = [
    { field: "id", headerName: "Order ID", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      cellClassName: (params) =>
        params.value === "Delivered" ? "greenColor" : "redColor",
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", flex: 1 },
    { field: "total", headerName: "Total", type: "number", flex: 1 },
    {
      field: "track",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/track/order/${params.id}`}>
          <Button>
            <MdTrackChanges size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="pl-8 pt-1">
      <DataGrid rows={rows} columns={columns} autoHeight pageSize={10} />
    </div>
  );
};

/* ===========================================================
   PAYMENT METHOD
=========================================================== */

const PaymentMethod = () => {
  return (
    <div className="w-full px-5">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-semibold text-[#000000ba]">
          Payment Methods
        </h1>

        <div className={`${styles.button} rounded-md`}>
          <span className="text-white">Add New</span>
        </div>
      </div>

      <br />

      <div className="w-full bg-white h-[70px] rounded-[5px] flex items-center px-3 shadow justify-between pr-10">
        <div className="flex items-center">
          <img
            src="https://bonik-react.vercel.app/assets/images/payment-methods/Visa.svg"
            alt="Visa"
          />
          <h5 className="pl-5 font-[600]">Tania Ashraf</h5>
        </div>

        <div className="pl-8 flex items-center">
          <h6>1234 **** **** ****</h6>
          <h5 className="pl-6">08/2026</h5>
        </div>

        <div className="min-w-[10%] flex justify-end pl-8">
          <AiOutlineDelete size={25} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

/* ===========================================================
   ADDRESS COMPONENT
=========================================================== */

const Address = () => {
  return (
    <div className="w-full px-5">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-semibold text-[#000000ba]">
          My Addresses
        </h1>

        <div className={`${styles.button} rounded-md`}>
          <span className="text-white">Add New</span>
        </div>
      </div>

      <br />

      <div className="w-full bg-white h-[70px] rounded-[5px] flex items-center px-3 shadow justify-between pr-10">
        <div className="min-w-[20%]">
          <h5 className="pl-5 font-[600]">Default</h5>
        </div>

        <div className="min-w-[50%] pl-8">
          <h6>494 Erdman Passage, New Zoile Town, IL 60622, USA</h6>
        </div>

        <div className="min-w-[10%] pl-8">
          <h6>(+880) 840-9416</h6>
        </div>

        <div className="min-w-[10%] flex justify-end pl-8">
          <AiOutlineDelete size={25} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
