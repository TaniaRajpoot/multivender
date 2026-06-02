import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye, AiOutlinePlus } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getAllEventsShop, deleteEvent } from "../../redux/actions/event";
import Loader from "../Layout/Loader";
import { toast } from "react-toastify";
import ListPage from "../ui/ListPage";
import { ui } from "../../styles/theme";

const AllEvents = () => {
  const { events, isLoading } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllEventsShop(seller._id));
    }
  }, [dispatch, seller]);

  const handleDelete = (id) => {
    if (window.confirm("Authorize terminal disposal of this campaign?")) {
      dispatch(deleteEvent(id));
      toast.success("Campaign sequence terminated");
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "CAMPAIGN ID",
      minWidth: 150,
      flex: 0.8,
      headerClassName: "grid-header"
    },
    {
      field: "name",
      headerName: "EVENT DESIGNATION",
      minWidth: 200,
      flex: 1.3,
      headerClassName: "grid-header"
    },
    {
      field: "price",
      headerName: "EVENT COST",
      minWidth: 120,
      flex: 0.6,
      headerClassName: "grid-header"
    },
    {
      field: "stock",
      headerName: "EVENT STOCK",
      type: "number",
      minWidth: 100,
      flex: 0.5,
      headerClassName: "grid-header"
    },
    {
      field: "sold",
      headerName: "CONVERSIONS",
      type: "number",
      minWidth: 120,
      flex: 0.6,
      headerClassName: "grid-header"
    },
    {
      field: "preview",
      headerName: "View",
      flex: 0.5,
      minWidth: 80,
      sortable: false,
      headerClassName: "grid-header",
      renderCell: (params) => (
        <Link to={`/product/${params.id}?isEvent=true`} className="text-teal-700 text-sm font-medium hover:underline">
          Details
        </Link>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.5,
      minWidth: 80,
      sortable: false,
      headerClassName: "grid-header",
      renderCell: (params) => (
        <button onClick={() => handleDelete(params.id)} className="text-red-600 hover:text-red-700 transition">
          <AiOutlineDelete size={20} />
        </button>
      ),
    },
  ];

  const rows = events?.map((item) => ({
    id: item._id,
    name: item.name,
    price: "$" + item.discountPrice,
    stock: item.stock,
    sold: item.sold_out ?? item.soldOut ?? 0,
  })) || [];

  return (
    <div className="p-4 sm:p-6">
      {isLoading ? (
        <Loader />
      ) : (
        <ListPage
          title="Live events"
          subtitle="Manage your promotional events and time-limited deals."
          action={
            <Link to="/dashboard-create-event" className={ui.btnPrimary}>
              <AiOutlinePlus size={18} /> New event
            </Link>
          }
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableRowSelectionOnClick
            autoHeight
          />
        </ListPage>
      )}
    </div>
  );
};

export default AllEvents;