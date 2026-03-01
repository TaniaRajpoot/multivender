import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight, AiOutlineShoppingCart } from "react-icons/ai";

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.8,
      headerClassName: "grid-header"
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.8,
      headerClassName: "grid-header",
      renderCell: (params) => {
        const isDelivered = params.row.status === "Delivered";
        return (
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isDelivered ? 'bg-green-50 text-green-600 border-green-200' : 'bg-[#FFA62B]/10 text-[#FFA62B] border-[#FFA62B]/20'}`}>
            {params.row.status}
          </div>
        );
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 120,
      flex: 0.6,
      headerClassName: "grid-header"
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 120,
      flex: 0.7,
      headerClassName: "grid-header"
    },
    {
      field: "action",
      flex: 0.5,
      minWidth: 100,
      headerName: "view",
      sortable: false,
      headerClassName: "grid-header",
      renderCell: (params) => (
        <Link to={`/order/${params.id}`}>
          <div className="w-10 h-10 bg-[#16697A]/5 text-[#16697A] rounded-xl flex items-center justify-center hover:bg-[#16697A] hover:text-white transition-all duration-300">
            <AiOutlineArrowRight size={20} />
          </div>
        </Link>
      ),
    },
  ];

  const rows = orders?.map((item) => ({
    id: item._id,
    itemsQty: item.cart.length,
    total: "$" + item.totalPrice,
    status: item.status,
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
                  <AiOutlineShoppingCart size={20} />
                </div>
                <p className="text-[10px] font-black text-[#489FB5] uppercase tracking-[0.4em]">Overview</p>
              </div>
              <h1 className="text-2xl font-black text-[#16697A] tracking-tighter italic uppercase">All Orders</h1>
            </div>
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
                .MuiDataGrid-root {
                  border: none !important;
                  font-family: 'Inter', sans-serif !important;
                }
                .MuiDataGrid-cell {
                  border-bottom: 1px solid #EDE7E3 !important;
                  color: #489FB5 !important;
                  font-weight: 700 !important;
                  display: flex !important;
                  align-items: center !important;
                }
                .MuiDataGrid-columnHeaders {
                  border-bottom: 2px solid #16697A !important;
                }
                .MuiDataGrid-row:hover {
                  background-color: #EDE7E3 !important;
                }
              `}
            </style>
            <div className="w-full">
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                autoHeight
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrders;