import React from "react";
import AdminLayout from "../components/ui/AdminLayout";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllOrdersOfAdmin } from "../redux/actions/order";
import ListPage from "../components/ui/ListPage";
import { ui } from "../styles/theme";

const AdminDashboardOrdersPage = () => {
  const dispatch = useDispatch();
  const { adminOrders, adminOrderLoading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.8, headerClassName: "grid-header" },
    { field: "status", headerName: "Status", minWidth: 130, flex: 0.6, headerClassName: "grid-header" },
    { field: "itemsQty", headerName: "Items", minWidth: 80, flex: 0.4, headerClassName: "grid-header" },
    { field: "total", headerName: "Total", minWidth: 100, flex: 0.5, headerClassName: "grid-header" },
    { field: "createdAt", headerName: "Date", minWidth: 110, flex: 0.5, headerClassName: "grid-header" },
  ];

  const sortedAdminOrders = adminOrders ? [...adminOrders].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    if (dateA === dateB) return String(b._id).localeCompare(String(a._id));
    return dateB - dateA;
  }) : [];

  const rows =
    sortedAdminOrders.map((item) => ({
      id: item._id,
      itemsQty: item?.cart?.reduce((acc, i) => acc + i?.qty, 0) || 0,
      total: `$${item.totalPrice}`,
      status: item.status,
      createdAt: item?.createdAt?.slice(0, 10),
    })) || [];

  return (
    <AdminLayout sidebarActive={2}>
      <ListPage title="All orders" subtitle="Every order placed on the marketplace." loading={adminOrderLoading}>
        <DataGrid rows={rows} columns={columns} pageSize={10} autoHeight disableRowSelectionOnClick />
      </ListPage>
    </AdminLayout>
  );
};

export default AdminDashboardOrdersPage;
