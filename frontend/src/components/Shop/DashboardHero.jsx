import React, { useEffect } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { FiPackage, FiShoppingBag } from "react-icons/fi";

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
    { field: "id", headerName: "Order ID", minWidth: 200, flex: 0.8 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.6,
      renderCell: (params) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${params.row.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
          {params.row.status}
        </span>
      )
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 120, flex: 0.4 },
    { field: "total", headerName: "Total", minWidth: 150, flex: 0.6 },
    {
      field: "view",
      headerName: "Details",
      flex: 0.4,
      minWidth: 120,
      renderCell: (params) => (
        <Link to={`/dashboard/order/${params.id}`}>
          <div className="w-10 h-10 rounded-xl bg-[#EDE7E3] flex items-center justify-center text-[#16697A] hover:bg-[#16697A] hover:text-white transition-all transform hover:scale-110">
            <AiOutlineArrowRight size={18} />
          </div>
        </Link>
      ),
    },
  ];

  const rows = orders?.map((item) => ({
    id: item._id,
    itemsQty: item.cart?.reduce((acc, i) => acc + i.qty, 0) || 0,
    total: "US$ " + item.totalPrice,
    status: item.status,
  })) || [];

  if (ordersLoading || productsLoading) return <Loader />;

  return (
    <div className="w-full p-4 md:p-6 lg:p-10 bg-[#EDE7E3]/50 min-h-screen">
      <div className="mb-6 md:mb-10">
        <h3 className="text-2xl md:text-3xl font-black text-[#16697A] tracking-tighter">Dashboard</h3>
        <p className="text-[#489FB5] text-[10px] font-black uppercase tracking-[0.3em] mt-1">Overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 mb-10">
        {/* Account Balance */}
        <StatCard
          icon={AiOutlineMoneyCollect}
          label="Account Balance"
          subLabel="(with 10% service charge)"
          value={`$${availableBalance}`}
          link="/dashboard-withdraw-money"
          linkText="Withdraw Money"
          color="#16697A"
        />

        {/* All Orders */}
        <StatCard
          icon={FiShoppingBag}
          label="All Orders"
          value={orders?.length || 0}
          link="/dashboard-orders"
          linkText="View Orders"
          color="#FFA62B"
        />

        {/* All Products */}
        <StatCard
          icon={FiPackage}
          label="All Products"
          value={products?.length || 0}
          link="/dashboard-products"
          linkText="View Products"
          color="#489FB5"
        />
      </div>

      {/* Latest Orders Table */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-6 md:p-8 border border-white shadow-soft animate-in fade-in duration-700">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-[#16697A] rounded-xl flex items-center justify-center text-white"><MdBorderClear size={22} /></div>
          <h3 className="text-2xl font-black text-[#16697A] tracking-tight">Latest Orders</h3>
        </div>
        <div className="data-grid-container custom-scrollbar overflow-hidden">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
            className="border-none! font-bold text-[#16697A]!"
            sx={{
              "& .MuiDataGrid-columnHeaders": { backgroundColor: "#EDE7E3", borderRadius: "16px", border: "none" },
              "& .MuiDataGrid-cell": { borderBottom: "1px solid #EDE7E3" },
              "& .MuiDataGrid-row:hover": { backgroundColor: "#EDE7E3/30" },
            }}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, subLabel, value, link, linkText, color }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 border border-white shadow-soft group hover:shadow-2xl transition-all duration-500 relative overflow-hidden transform hover:-translate-y-2">
    <div className="absolute top-0 right-0 w-32 h-32 bg-[#16697A]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
    <div className="flex items-center gap-4 mb-6">
      <div className="p-4 rounded-2xl shadow-lg transition-transform duration-500 group-hover:rotate-12" style={{ backgroundColor: color, color: "white" }}>
        <Icon size={24} />
      </div>
      <div>
        <h4 className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">{label}</h4>
        {subLabel && <p className="text-[8px] font-bold text-[#9CA3AF] uppercase tracking-widest">{subLabel}</p>}
      </div>
    </div>
    <h5 className="text-4xl font-black text-[#16697A] tracking-tighter mb-6">{value}</h5>
    <Link to={link}>
      <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#489FB5] hover:text-[#16697A] transition-colors group/link">
        {linkText}
        <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
      </span>
    </Link>
  </div>
);

export default DashboardHero;