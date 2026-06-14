import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye, AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop, deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import ListPage from "../ui/ListPage";
import { ui } from "../../styles/theme";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.product);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) dispatch(getAllProductsShop(seller._id));
  }, [dispatch, seller]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      dispatch(deleteProduct(id));
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const columns = [
    { field: "name", headerName: "Product", minWidth: 180, flex: 1.2, headerClassName: "grid-header" },
    { field: "price", headerName: "Price", minWidth: 90, flex: 0.5, headerClassName: "grid-header" },
    { field: "Stock", headerName: "Stock", minWidth: 80, flex: 0.4, headerClassName: "grid-header" },
    { field: "sold", headerName: "Sold", minWidth: 80, flex: 0.4, headerClassName: "grid-header" },
    {
      field: "Preview",
      headerName: "View",
      minWidth: 70,
      sortable: false,
      headerClassName: "grid-header",
      renderCell: (params) => (
        <Link to={`/product/${params.id}`} className="text-teal-700 text-sm font-medium hover:underline">View</Link>
      ),
    },
    {
      field: "Delete",
      headerName: "Delete",
      minWidth: 70,
      sortable: false,
      headerClassName: "grid-header",
      renderCell: (params) => (
        <button type="button" onClick={() => handleDelete(params.id)} className="text-red-600 text-sm font-medium hover:underline">
          Delete
        </button>
      ),
    },
  ];

  const rows =
    products?.map((item) => ({
      id: item._id,
      name: item.name,
      price: `$${item.discountPrice}`,
      Stock: item.stock,
      sold: item?.sold_out ?? item?.soldOut ?? 0,
    })) || [];

  if (isLoading) return <Loader />;

  return (
    <ListPage
      title="Your products"
      subtitle="Manage what you sell in your shop."
      action={
        <Link to="/dashboard-create-product" className={ui.btnPrimary}>
          <AiOutlinePlus size={18} /> Add product
        </Link>
      }
    >
      <DataGrid rows={rows} columns={columns} pageSize={10} disableRowSelectionOnClick autoHeight />
    </ListPage>
  );
};

export default AllProducts;
