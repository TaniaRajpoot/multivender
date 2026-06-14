import React, { useEffect, useState } from "react";
import { BsPencil } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { DataGrid } from "@mui/x-data-grid";
import { RxCross1 } from "react-icons/rx";
import ListPage from "../ui/ListPage";
import { ui } from "../../styles/theme";

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
        { sellerId: withdrawData.shopId },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Withdraw request updated successfully!");
        setData(res.data.withdraws);
        setOpen(false);
      });
  };

  const columns = [
    { field: "id", headerName: "Withdraw ID", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Shop Name", minWidth: 180, flex: 1.4 },
    { field: "shopId", headerName: "Shop ID", minWidth: 180, flex: 1.4 },
    { field: "amount", headerName: "Amount", minWidth: 100, flex: 0.6 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => (
        <span className={`${ui.badge} ${params.value === "Succeed" ? ui.badgeGreen : ui.badgeYellow}`}>
          {params.value}
        </span>
      ),
    },
    { field: "createdAt", headerName: "Requested", flex: 0.6, minWidth: 130 },
    {
      field: "action",
      headerName: "Update",
      flex: 0.5,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <button
          onClick={() => { setOpen(true); setWithdrawData(params.row); }}
          disabled={params.row.status !== "Processing"}
          className={`flex items-center gap-1 text-sm font-medium transition ${
            params.row.status !== "Processing"
              ? "text-gray-300 cursor-not-allowed"
              : "text-teal-700 hover:underline"
          }`}
        >
          <BsPencil size={14} /> Edit
        </button>
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
    <div className="p-4 sm:p-6">
      <ListPage title="Withdraw requests" subtitle="Review and approve seller withdrawal requests.">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableRowSelectionOnClick
          autoHeight
        />
      </ListPage>

      {/* Update Status Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className={`w-full max-w-sm ${ui.card} ${ui.cardPadding} relative`}>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <RxCross1 size={18} />
            </button>

            <h3 className={`${ui.titleSm} mb-1`}>Update withdraw status</h3>
            <p className="text-sm text-gray-500 mb-5">
              Shop: <span className="font-medium text-gray-900">{withdrawData?.name}</span>
              {" · "}Amount: <span className="font-medium text-gray-900">{withdrawData?.amount}</span>
            </p>

            <div className="space-y-4">
              <div>
                <label className={ui.label}>New status</label>
                <select
                  value={withdrawStatus}
                  onChange={(e) => setWithdrawStatus(e.target.value)}
                  className={ui.select}
                >
                  <option value="Processing">Processing</option>
                  <option value="Succeed">Succeed</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setOpen(false)} className={`${ui.btnSecondary} flex-1`}>
                  Cancel
                </button>
                <button onClick={handleSubmit} className={`${ui.btnPrimary} flex-1`}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;