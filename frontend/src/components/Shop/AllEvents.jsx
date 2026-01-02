
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useSelector ,useDispatch} from "react-redux";
import { Link } from "react-router-dom";
import { getAllEventsShop, deleteEvent } from "../../redux/actions/event";
import Loader from "../Layout/Loader";
import { toast } from "react-toastify";

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
    toast.success("Event Deleted Successfully");
    dispatch(deleteEvent(id));
    window.location.reload();
  };

  const columns = [
    { field: "id", headerName: "Event ID", minWidth: 150, flex: 0.8 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.3,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "sold",
      headerName: "Sold Out",
      type: "number",
      minWidth: 120,
      flex: 0.6,
    },
    {
      field: "preview",
      headerName: "",
      flex: 0.6,
      minWidth: 80,
      sortable: false,
      renderCell: (params) => {
        const eventName = params.row.name.replace(/\s+/g, "-");
        return (
          <Link to={`/product/${eventName}`}>
            <Button>
              <AiOutlineEye size={20} />
            </Button>
          </Link>
        );
      },
    },
    {
      field: "delete",
      headerName: "",
      flex: 0.6,
      minWidth: 80,
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const rows =
    events?.map((item) => ({
      id: item._id,
      name: item.name,
      price: "US$ " + item.discountPrice,
      stock: item.stock,
      sold: item.sold_out,
    })) || [];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full bg-white p-3 md:p-6 rounded-md shadow-sm">
          <h1 className="text-lg md:text-2xl font-semibold text-gray-800 mb-3 md:mb-6">
            All Events
          </h1>

          {/* Responsive Scroll Wrapper for Mobile */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px]">
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
    </>
  );
};

export default AllEvents;