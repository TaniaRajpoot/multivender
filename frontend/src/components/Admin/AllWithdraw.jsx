import React, { useEffect, useState } from "react";
import { BsPencil } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { DataGrid } from "@mui/x-data-grid";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";

const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus, setWithdrawStatus] = useState("Processing");

  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error.response?.data.message);
      });
  }, []);

  const handleSubmit = async () => {
    axios
      .put(
        `${server}/withdraw/update-withdraw-request/${withdrawData.id}`,
        {
          sellerId: withdrawData.shopId,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Withdraw request updated successfully!");
        setData(res.data.withdraws);
        setOpen(false);
      });
  };

  const columns = [
    { field: "id", headerName: "Withdraw Id", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Shop Name", minWidth: 180, flex: 1.4 },
    { field: "shopId", headerName: "Shop Id", minWidth: 180, flex: 1.4 },
    { field: "amount", headerName: "Amount", minWidth: 100, flex: 0.6 },
    { field: "status", headerName: "status", flex: 0.5, minWidth: 100 },
    { field: "createdAt", headerName: "Request given at", flex: 0.6, minWidth: 130 },
    {
      field: "action",
      headerName: "Update Status",
      flex: 0.6,
      minWidth: 130,
      renderCell: (params) => (
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen(true) || setWithdrawData(params.row)}
            disabled={params.row.status !== "Processing"}
            className={`${params.row.status !== "Processing" ? "opacity-30 cursor-not-allowed" : "hover:scale-110 active:scale-95"} w-10 h-10 rounded-xl bg-[#EDE7E3] text-[#16697A] flex items-center justify-center transition-all shadow-sm`}
          >
            <BsPencil size={18} />
          </button>
        </div>
      ),
    },
  ];

  const row = data?.map((item) => ({
    id: item._id,
    shopId: item.seller._id,
    name: item.seller.name,
    amount: "US$ " + item.amount,
    status: item.status,
    createdAt: item.createdAt.slice(0, 10),
  })) || [];

  return (
    <div className="w-full min-h-[85vh] p-4 md:p-8 bg-[#EDE7E3]/30">
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom duration-700">
        <div className="flex items-center gap-4 mb-8 ml-2">
          <div className="w-2 h-8 bg-[#FFA62B] rounded-full" />
          <h3 className="text-2xl font-black text-[#16697A] tracking-tighter uppercase italic">All Withdraw Requests</h3>
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

      {open && (
        <div className="fixed inset-0 z-[999] bg-[#0F4D58]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[40px] p-8 md:p-12 border border-white shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-end mb-4">
              <button onClick={() => setOpen(false)} className="w-10 h-10 bg-[#EDE7E3] text-[#16697A] rounded-xl flex items-center justify-center hover:rotate-90 transition-all">
                <RxCross1 size={20} />
              </button>
            </div>
            <h3 className="text-xl text-center mb-8 font-black text-[#16697A] tracking-tighter italic">
              Update Withdraw Status
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#489FB5] uppercase tracking-widest ml-1">Current Status: {withdrawData?.status}</label>
                <select
                  value={withdrawStatus}
                  onChange={(e) => setWithdrawStatus(e.target.value)}
                  className="w-full bg-[#EDE7E3]/50 border border-transparent rounded-2xl px-6 py-4 font-bold text-[#16697A] shadow-inner outline-none focus:bg-white transition-all appearance-none"
                >
                  <option value="Processing">Processing</option>
                  <option value="Succeed">Succeed</option>
                </select>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full h-16 bg-[#16697A] text-white font-black rounded-2xl hover:bg-[#FFA62B] transition-all duration-500 shadow-xl mt-4 uppercase tracking-[0.2em] text-[13px]"
              >
                Update Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;