import React, { useEffect } from "react";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdBorderClear } from "react-icons/md";
import { DataGrid } from "@mui/x-data-grid";
import { getAllOrdersOfAdmin } from "../../../redux/actions/order";
import Loader from "../../../components/Layout/Loader";
import { getAllSellers } from "../../../redux/actions/seller";
import { FiUsers, FiLayers } from "react-icons/fi";
import { ui } from "../../../styles/theme";

const AdminDashBoardMain = () => {
  const dispatch = useDispatch();
  const { adminOrders, adminOrderLoading } = useSelector((state) => state.order);
  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 200, flex: 0.8 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.6,
      renderCell: (params) => (
        <span className={`${ui.badge} ${params.row.status === "Delivered" ? ui.badgeGreen : ui.badgeYellow}`}>
          {params.row.status}
        </span>
      ),
    },
    { field: "itemsQty", headerName: "Items", type: "number", minWidth: 80, flex: 0.4 },
    { field: "total", headerName: "Total", minWidth: 120, flex: 0.5 },
    { field: "createdAt", headerName: "Date", minWidth: 130, flex: 0.5 },
  ];

  const sortedAdminOrders = adminOrders ? [...adminOrders].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    if (dateA === dateB) return String(b._id).localeCompare(String(a._id));
    return dateB - dateA;
  }) : [];

  const row = sortedAdminOrders.map((item) => ({
    id: item._id,
    itemsQty: item?.cart.reduce((acc, i) => acc + i?.qty, 0),
    total: `$${item.totalPrice}`,
    status: item.status,
    createdAt: item?.createdAt.slice(0, 10),
  })) || [];

  const adminEarning = adminOrders?.reduce((acc, item) => acc + item.totalPrice * 0.1, 0) || 0;
  const adminBalance = adminEarning.toFixed(2);

  if (adminOrderLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className={ui.title}>Admin overview</h1>
        <p className={ui.subtitle}>Monitor the marketplace from a single place.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={AiOutlineMoneyCollect}
          label="Platform earnings"
          value={`$${adminBalance}`}
          hint="10% commission on all orders"
          color="teal"
        />
        <StatCard
          icon={FiUsers}
          label="Active sellers"
          value={sellers?.length || 0}
          link="/admin-sellers"
          linkText="View sellers"
          color="blue"
        />
        <StatCard
          icon={FiLayers}
          label="Total orders"
          value={adminOrders?.length || 0}
          link="/admin-orders"
          linkText="View orders"
          color="orange"
        />
      </div>

      {/* Latest Orders Table */}
      <div className={`${ui.card} p-5 sm:p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-teal-700 rounded-lg flex items-center justify-center text-white shrink-0">
            <MdBorderClear size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Latest orders</h2>
            <p className="text-xs text-gray-500">Most recent marketplace transactions</p>
          </div>
        </div>
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          autoHeight
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, hint, link, linkText, color }) => {
  const colorMap = {
    teal: "bg-teal-50 text-teal-700",
    blue: "bg-blue-50 text-blue-700",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className={`${ui.card} p-5`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colorMap[color] || colorMap.teal}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">{label}</p>
          {hint && <p className="text-[10px] text-gray-400">{hint}</p>}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {link && (
        <Link to={link} className="inline-block mt-3 text-sm font-semibold text-teal-700 hover:underline">
          {linkText} →
        </Link>
      )}
    </div>
  );
};

export default AdminDashBoardMain;
