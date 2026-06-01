import React, { useEffect } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import PageHeader from "../ui/PageHeader";
import { ui } from "../../styles/theme";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders, isLoading: ordersLoading } = useSelector((state) => state.order);
  const { products, isLoading: productsLoading } = useSelector((state) => state.product);
  const { seller } = useSelector((state) => state.seller);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const availableBalance = seller?.availableBalance?.toFixed(2) || "0.00";

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 180, flex: 0.8, headerClassName: "grid-header" },
    { field: "status", headerName: "Status", minWidth: 130, flex: 0.6, headerClassName: "grid-header" },
    { field: "itemsQty", headerName: "Items", type: "number", minWidth: 80, flex: 0.4, headerClassName: "grid-header" },
    { field: "total", headerName: "Total", minWidth: 100, flex: 0.5, headerClassName: "grid-header" },
    {
      field: "view",
      headerName: "View",
      flex: 0.3,
      minWidth: 80,
      sortable: false,
      headerClassName: "grid-header",
      renderCell: (params) => (
        <Link to={`/dashboard-order/${params.id}`} className="text-teal-700 font-medium text-sm hover:underline">
          Details
        </Link>
      ),
    },
  ];

  const rows =
    orders?.map((item) => ({
      id: item._id,
      itemsQty: item.cart?.reduce((acc, i) => acc + i.qty, 0) || 0,
      total: `$${item.totalPrice}`,
      status: item.status,
    })) || [];

  if (ordersLoading || productsLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader title="Shop overview" subtitle="Quick summary of your store activity." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={AiOutlineMoneyCollect} label="Available balance" value={`$${availableBalance}`} link="/dashboard-withdraw-money" linkText="Withdraw" />
        <StatCard icon={FiShoppingBag} label="Total orders" value={orders?.length || 0} link="/dashboard-orders" linkText="View orders" />
        <StatCard icon={FiPackage} label="Products listed" value={products?.length || 0} link="/dashboard-products" linkText="View products" />
      </div>

      <div className={`${ui.card} p-4 sm:p-6`}>
        <h2 className={ui.sectionTitle}>Recent orders</h2>
        <p className={ui.subtitle}>Click Details to manage an order.</p>
        <div className="mt-4 w-full">
          <DataGrid rows={rows} columns={columns} pageSize={5} autoHeight disableRowSelectionOnClick />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, link, linkText }) => (
  <div className={`${ui.card} p-5`}>
    <div className="flex items-center gap-3 mb-3 text-teal-700">
      <Icon size={22} />
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    {link && (
      <Link to={link} className="inline-block mt-3 text-sm font-semibold text-teal-700 hover:underline">
        {linkText} →
      </Link>
    )}
  </div>
);

export default DashboardHero;
