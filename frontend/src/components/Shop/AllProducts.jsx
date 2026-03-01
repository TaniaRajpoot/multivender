import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye, AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop, deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import { RxCross1 } from "react-icons/rx";
import { FiPackage } from "react-icons/fi";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.product);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller]);

  const handleDelete = (id) => {
    if (window.confirm("Authorize permanent deletion of this asset?")) {
      dispatch(deleteProduct(id));
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ASSET ID",
      minWidth: 150,
      flex: 0.7,
      headerClassName: "grid-header"
    },
    {
      field: "name",
      headerName: "ITEM DESIGNATION",
      minWidth: 200,
      flex: 1.4,
      headerClassName: "grid-header"
    },
    {
      field: "price",
      headerName: "RETAIL VAL.",
      minWidth: 120,
      flex: 0.6,
      headerClassName: "grid-header"
    },
    {
      field: "Stock",
      headerName: "INVENTORY",
      type: "number",
      minWidth: 100,
      flex: 0.5,
      headerClassName: "grid-header"
    },
    {
      field: "sold",
      headerName: "LIQUIDATED",
      type: "number",
      minWidth: 120,
      flex: 0.6,
      headerClassName: "grid-header"
    },
    {
      field: "Preview",
      flex: 0.5,
      minWidth: 80,
      headerName: "VIEW",
      sortable: false,
      headerClassName: "grid-header",
      renderCell: (params) => (
        <Link to={`/product/${params.id}`}>
          <div className="w-10 h-10 bg-[#16697A]/5 text-[#16697A] rounded-xl flex items-center justify-center hover:bg-[#16697A] hover:text-white transition-all duration-300">
            <AiOutlineEye size={20} />
          </div>
        </Link>
      ),
    },
    {
      field: "Delete",
      flex: 0.5,
      minWidth: 80,
      headerName: "PURGE",
      sortable: false,
      headerClassName: "grid-header",
      renderCell: (params) => (
        <button onClick={() => handleDelete(params.id)} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300">
          <AiOutlineDelete size={20} />
        </button>
      ),
    },
  ];

  const rows = products?.map((item) => ({
    id: item._id,
    name: item.name,
    price: "$" + item.discountPrice,
    Stock: item.stock,
    sold: item?.sold_out || 0,
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
                  <FiPackage size={20} />
                </div>
                <p className="text-[10px] font-black text-[#489FB5] uppercase tracking-[0.4em]">Asset Registry</p>
              </div>
              <h1 className="text-2xl font-black text-[#16697A] tracking-tighter italic uppercase">Asset Portfolio</h1>
            </div>
            <Link to="/dashboard-create-product">
              <button className="px-8 py-4 bg-[#16697A] text-white font-black rounded-2xl hover:bg-[#FFA62B] transition-all transform hover:scale-105 shadow-xl flex items-center gap-3 uppercase tracking-widest text-[10px]">
                <AiOutlinePlus size={18} /> Add New Asset
              </button>
            </Link>
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
                  background-color: transparent !important;
                }
                .MuiDataGrid-row:hover {
                  background-color: #EDE7E3 !important;
                  cursor: pointer !important;
                }
                .MuiDataGrid-footerContainer {
                  border-top: 1px solid #EDE7E3 !important;
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
                className="custom-data-grid"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;