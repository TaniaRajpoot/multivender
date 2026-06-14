import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import ListPage from "../ui/ListPage";

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller?._id]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 160, flex: 0.8, headerClassName: "grid-header" },
    { field: "status", headerName: "Status", minWidth: 140, flex: 0.7, headerClassName: "grid-header" },
    { field: "itemsQty", headerName: "Items", minWidth: 80, flex: 0.4, headerClassName: "grid-header" },
    { field: "total", headerName: "Total", minWidth: 100, flex: 0.5, headerClassName: "grid-header" },
    {
      field: "action",
      headerName: "View",
      minWidth: 80,
      sortable: false,
      headerClassName: "grid-header",
      renderCell: (params) => (
        <Link to={`/dashboard-order/${params.id}`} className="text-teal-700 text-sm font-medium hover:underline">
          Details
        </Link>
      ),
    },
  ];

  const sortedOrders = orders ? [...orders].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    if (dateA === dateB) return String(b._id).localeCompare(String(a._id));
    return dateB - dateA;
  }) : [];

  const rows =
    sortedOrders.map((item) => ({
      id: item._id,
      itemsQty: item.cart?.length || 0,
      total: `$${item.totalPrice}`,
      status: item.status,
    })) || [];

  if (isLoading) return <Loader />;

  return (
    <ListPage title="Orders" subtitle="All customer orders for your shop.">
      <DataGrid rows={rows} columns={columns} pageSize={10} disableRowSelectionOnClick autoHeight />
    </ListPage>
  );
};

export default AllOrders;
