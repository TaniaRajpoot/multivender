import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import ListPage from "../ui/ListPage";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${server}/event/admin-all-events`, { withCredentials: true })
      .then((res) => {
        setEvents(res.data.events);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to load events");
        setLoading(false);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7, headerClassName: "grid-header" },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.4, headerClassName: "grid-header" },
    { field: "price", headerName: "Price", minWidth: 100, flex: 0.6, headerClassName: "grid-header" },
    { field: "Stock", headerName: "Stock", type: "number", minWidth: 80, flex: 0.5, headerClassName: "grid-header" },
    { field: "sold", headerName: "Sold out", type: "number", minWidth: 130, flex: 0.6, headerClassName: "grid-header" },
    {
      field: "action",
      headerName: "Preview",
      flex: 0.8,
      minWidth: 100,
      sortable: false,
      headerClassName: "grid-header",
      renderCell: (params) => (
        <Link to={`/product/${params.id}?isEvent=true`} className="text-teal-700 text-sm font-medium hover:underline">
          Details
        </Link>
      ),
    },
  ];

  const row = events?.map((item) => ({
    id: item._id,
    name: item.name,
    price: "$" + item.discountPrice,
    Stock: item.stock,
    sold: item?.sold_out || 0,
  })) || [];

  return (
    <div className="p-4 sm:p-6">
      <ListPage title="All events" subtitle="Review all active and finished promotional events." loading={loading}>
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableRowSelectionOnClick
          autoHeight
        />
      </ListPage>
    </div>
  );
};

export default AllEvents;