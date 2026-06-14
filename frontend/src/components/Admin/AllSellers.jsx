import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllSellers } from "../../redux/actions/seller";
import { Link } from "react-router-dom";
import ListPage from "../ui/ListPage";
import { ui } from "../../styles/theme";

const AllSellers = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { sellers } = useSelector((state) => state.seller);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/shop/admin-delete-seller/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllSellers());
      })
      .catch((error) => {
        toast.error(error.response?.data.message);
      });
  };

  const columns = [
    { field: "id", headerName: "Seller ID", flex: 0.7, minWidth: 150 },
    { field: "name", headerName: "Name", flex: 0.7, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 0.7, minWidth: 200 },
    { field: "address", headerName: "Address", flex: 0.7, minWidth: 200 },
    { field: "joinedAt", headerName: "Joined", flex: 0.5, minWidth: 120 },
    {
      field: "preview",
      headerName: "Preview",
      flex: 0.5,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/shop/preview/${params.id}`} className="text-teal-700 text-sm font-medium hover:underline flex items-center gap-1">
          <AiOutlineEye size={16} /> View
        </Link>
      ),
    },
    {
      field: "action",
      headerName: "Delete",
      flex: 0.5,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <button
          onClick={() => { setUserId(params.id); setOpen(true); }}
          className="text-red-600 text-sm font-medium hover:underline flex items-center gap-1"
        >
          <AiOutlineDelete size={16} /> Delete
        </button>
      ),
    },
  ];

  const row = sellers?.map((item) => ({
    id: item._id,
    name: item.name,
    email: item.email,
    joinedAt: item.createdAt.slice(0, 10),
    address: item.address,
  })) || [];

  return (
    <div className="p-4 sm:p-6">
      <ListPage title="All sellers" subtitle="View and manage registered seller accounts.">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableRowSelectionOnClick
          autoHeight
        />
      </ListPage>

      {/* Delete Confirm Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className={`w-full max-w-sm ${ui.card} ${ui.cardPadding} relative`}>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <RxCross1 size={18} />
            </button>
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AiOutlineDelete size={24} className="text-red-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Delete seller?</h3>
              <p className="text-sm text-gray-500 mb-6">This action cannot be undone. The seller account will be permanently removed.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className={`${ui.btnSecondary} flex-1`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setOpen(false); handleDelete(userId); }}
                  className={`${ui.btnDanger} flex-1`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSellers;