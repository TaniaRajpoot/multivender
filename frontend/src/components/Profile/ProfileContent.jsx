import React, { useState } from "react";
import { backend_url } from "../../server";
import { useSelector } from "react-redux";
import { AiOutlineCamera, AiOutlineArrowRight, AiOutlineDelete } from "react-icons/ai";
import styles from "../../styles/styles";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";

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

      {/* ==================== PROFILE =================== */}
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={`${backend_url}${user?.avatar}`}
                alt="Profile"
                className="w-[120px] h-[120px] rounded-full object-cover"
              />
              <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-5 right-5">
                <AiOutlineCamera />
              </div>
            </div>
          </div>

          <div className="w-full px-5 mt-6">
            <form className="flex w-full flex-wrap" onSubmit={handleSubmit}>
              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%]`}
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                  />
                </div>

                <div className="w-[50%] pb-3">
                  <label className="block pb-2">Email</label>
                  <input
                    type="email"
                    className={`${styles.input} !w-[95%]`}
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="number"
                    className={`${styles.input} !w-[95%]`}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="w-[50%] pb-3">
                  <label className="block pb-2">Zip Code</label>
                  <input
                    type="number"
                    className={`${styles.input} !w-[95%]`}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2">Address 1</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%]`}
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                  />
                </div>

                <div className="w-[50%] pb-3">
                  <label className="block pb-2">Address 2</label>
                  <input
                    type="text"
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

      {/* ==================== ORDERS =================== */}
      {active === 2 &&
      <div>
        <AllOrders />
      </div>
}

      {/* ==================== REFUND ORDERS =================== */}
      {active === 3 &&
      <div>
        <AllRefundOrders />
      </div> 
      }

      {/* ==================== TRACK ORDER =================== */}
      {active === 5 &&
      <div>
      <TrackOrder />
      </div>
       }

      
      {/* ==================== Payment Method    =================== */}
      {active === 6 && 
      <div>
        <PaymentMethod />
      </div>
      }
      {/* ==================== User Address   =================== */}
      {active === 7 && 
      <div>
        <Address/>
      </div>
      }
    </div>
  );
};


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
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      flex: 1,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      flex: 1,
    },
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
      headerName: "",
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

const PaymentMethod = () => {
  return (
    <div className="w-full px-5" >  
    <div className="flex w-full items-center justify-between">
      <h1 className="text-[25px] font-semibold text-[#000000ba]">
        Payments Method
      </h1>
      <div className={`${styles.button} rounded-md` }>
        <span className="text-white">Add New</span>
      </div>
    </div>
    <br />
    <div className="w-full bg-white h-[70px] flex items-center justify-between pr-10">
      <div className="flex items-center">
        <img 
        src="https://bonik-react.vercel.app/assets/images/payment-methods/Visa.svg"
        alt="" />
        <h5 className="pl-5 font-semibold">Tania Ashraf</h5>
      </div>
      <div className="pl-8 flex items-center">
       <h6>
         1234***** **** ****
        </h6>
        <h5 className="pl-6">08/2026</h5>
      </div>
      <div className="min-w-[10%] flex items-center justify-between">
        <AiOutlineDelete size={25} className="cursor-pointer" />
      </div>

      

    </div>
    </div>
  );
};

const Address = () => {
  return (
    <div className="w-full px-5" >  
    <div className="flex w-full items-center justify-between">
      <h1 className="text-[25px] font-semibold text-[#000000ba]">
      My Addresses
      </h1>
      <div className={`${styles.button} rounded-md` }>
        <span className="text-white">Add New</span>
      </div>
    </div>
    <br />
    <div className="w-full bg-white h-[70px] flex items-center justify-between pr-10">
      <div className="flex items-center">
        <h5 className="pl-5 font-semibold">Deafult </h5>
      </div>
      <div className="pl-8 flex items-center">
       <h6>
         494 Erdman Passage, New Zoile Town , IL 60622, USA
        </h6>
      </div>
      <div className="pl-8 flex items-center">
       <h6>
        (+880) 840-9416
        </h6>
      </div>
      <div className="min-w-[10%] flex items-center justify-between">
        <AiOutlineDelete size={25} className="cursor-pointer" />
      </div>

      

    </div>
    </div>
  );
}

export default ProfileContent;
 