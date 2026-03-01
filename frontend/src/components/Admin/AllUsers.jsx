import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/actions/user";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllUsers = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { users } = useSelector((state) => state.user);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/user/admin-delete-user/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllUsers());
      })
      .catch((error) => {
        toast.error(error.response?.data.message);
      });
  };

  const columns = [
    { field: "id", headerName: "User ID", flex: 0.7, minWidth: 150 },
    { field: "name", headerName: "Name", flex: 0.7, minWidth: 150 },
    { field: "email", headerName: "Email", type: "email", flex: 0.7, minWidth: 200 },
    { field: "role", headerName: "Role", flex: 0.5, minWidth: 100 },
    { field: "joinedAt", headerName: "joinedAt", flex: 0.5, minWidth: 120 },
    {
      field: "action",
      headerName: "Delete User",
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => (
        <Button onClick={() => setUserId(params.id) || setOpen(true)}>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform hover:rotate-12">
            <AiOutlineDelete size={20} />
          </div>
        </Button>
      ),
    },
  ];

  const row = users?.map((item) => ({
    id: item._id,
    name: item.name,
    email: item.email,
    role: item.role,
    joinedAt: item.createdAt.slice(0, 10),
  })) || [];

  return (
    <div className="w-full min-h-[85vh] p-4 md:p-8 bg-[#EDE7E3]/30">
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom duration-700">
        <div className="flex items-center gap-4 mb-8 ml-2">
          <div className="w-2 h-8 bg-[#FFA62B] rounded-full" />
          <h3 className="text-2xl font-black text-[#16697A] tracking-tighter uppercase italic">All Users</h3>
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
            <h3 className="text-xl text-center mb-10 font-black text-[#16697A] tracking-tighter italic">
              Are you sure you wanna delete this user?
            </h3>
            <div className="flex gap-4">
              <button onClick={() => setOpen(false)} className="flex-1 h-14 border-2 border-[#16697A] text-[#16697A] font-black rounded-2xl hover:bg-[#16697A] hover:text-white transition-all uppercase tracking-widest text-xs">
                cancel
              </button>
              <button onClick={() => setOpen(false) || handleDelete(userId)} className="flex-1 h-14 bg-[#16697A] text-white font-black rounded-2xl hover:bg-red-500 transition-all shadow-lg uppercase tracking-widest text-xs">
                confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AllUsers;