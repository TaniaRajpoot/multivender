import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { toast } from "react-toastify";
import { server } from "../../server";
import axios from "axios";


const AllProducts = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${server}/product/admin-all-products`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.products);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.4 },
    { field: "price", headerName: "Price", minWidth: 100, flex: 0.6 },
    { field: "Stock", headerName: "Stock", type: "number", minWidth: 80, flex: 0.5 },
    { field: "sold", headerName: "Sold out", type: "number", minWidth: 130, flex: 0.6 },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "Preview",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/product/${params.id}`}>
          <div className="w-10 h-10 rounded-xl bg-[#EDE7E3] text-[#16697A] flex items-center justify-center hover:bg-[#16697A] hover:text-white transition-all transform hover:scale-110">
            <AiOutlineEye size={20} />
          </div>
        </Link>
      ),
    },
  ];

  const row = data?.map((item) => ({
    id: item._id,
    name: item.name,
    price: "US$ " + item.discountPrice,
    Stock: item.stock,
    sold: item?.sold_out,
  })) || [];

  return (
    <div className="w-full min-h-[85vh] p-4 md:p-8 bg-[#EDE7E3]/30">
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom duration-700">
        <div className="flex items-center gap-4 mb-8 ml-2">
          <div className="w-2 h-8 bg-[#FFA62B] rounded-full" />
          <h3 className="text-2xl font-black text-[#16697A] tracking-tighter uppercase italic">All Products</h3>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 border border-white shadow-soft custom-scrollbar overflow-x-auto">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableRowSelectionOnClick
            autoHeight
            className="border-none! font-sans"
            sx={{
              "& .MuiDataGrid-main": { borderRadius: "32px", overflow: "hidden" },
              "& .MuiDataGrid-columnHeaders": { backgroundColor: "#EDE7E3", color: "#16697A", fontWeight: "900", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.1em", border: "none" },
              "& .MuiDataGrid-cell": { borderBottom: "1px solid #EDE7E3", color: "#6B7280", fontWeight: "600", fontSize: "13px" },
              "& .MuiDataGrid-footerContainer": { borderTop: "none" },
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default AllProducts;