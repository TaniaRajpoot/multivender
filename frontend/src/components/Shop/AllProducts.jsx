import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState,useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import { deleteProduct } from "../../redux/actions/product"; 
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";


const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.product);  
  const { seller } = useSelector((state) => state.seller);
  const [open , setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller]);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    window.location.reload();
   
  };

  
  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];

  products &&
    products.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "US$ " + item.discountPrice,
        Stock: item.stock,
        sold: item?.sold_out || 0,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
         
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
   
        </div>
      )}
    </>
  );
};

export default AllProducts;


// import { Button } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import React, { useEffect } from "react";
// import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { getAllProductsShop, deleteProduct } from "../../redux/actions/product";
// import Loader from "../Layout/Loader";
// import { toast } from "react-toastify";

// const AllProducts = () => {
//   const { products, isLoading } = useSelector((state) => state.products);
//   const { seller } = useSelector((state) => state.seller);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (seller?._id) {
//       dispatch(getAllProductsShop(seller._id));
//     }
//   }, [dispatch, seller]);

//   const handleDelete = async (id) => {
//     try {
//       await dispatch(deleteProduct(id));
//       toast.success("Product deleted successfully!");
//       window.location.reload();
//     } catch (error) {
//       toast.error("Failed to delete product");
//     }
//   };

//   const columns = [
//     { field: "id", headerName: "Product ID", minWidth: 150, flex: 0.7 },
//     {
//       field: "name",
//       headerName: "Name",
//       minWidth: 180,
//       flex: 1.4,
//     },
//     {
//       field: "price",
//       headerName: "Price",
//       minWidth: 100,
//       flex: 0.6,
//     },
//     {
//       field: "Stock",
//       headerName: "Stock",
//       type: "number",
//       minWidth: 80,
//       flex: 0.5,
//     },
//     {
//       field: "sold",
//       headerName: "Sold Out",
//       type: "number",
//       minWidth: 120,
//       flex: 0.6,
//     },
//     {
//       field: "Preview",
//       flex: 0.8,
//       minWidth: 100,
//       headerName: "Preview",
//       sortable: false,
//       renderCell: (params) => (
//         <Link to={`/product/${params.id}`}>
//           <Button>
//             <AiOutlineEye size={20} />
//           </Button>
//         </Link>
//       ),
//     },
//     {
//       field: "Delete",
//       flex: 0.8,
//       minWidth: 100,
//       headerName: "Delete",
//       sortable: false,
//       renderCell: (params) => (
//         <Button onClick={() => handleDelete(params.id)}>
//           <AiOutlineDelete size={20} className="text-red-500 hover:text-red-700" />
//         </Button>
//       ),
//     },
//   ];

//   const rows =
//     products?.map((item) => ({
//       id: item._id,
//       name: item.name,
//       price: "US$ " + item.discountPrice,
//       Stock: item.stock,
//       sold: item?.sold_out || 0,
//     })) || [];

//   return (
//     <>
//       {isLoading ? (
//         <Loader />
//       ) : (
//         <div className="w-full bg-white p-3 md:p-6 rounded-md shadow-sm">
//           <h1 className="text-lg md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">
//             All Products
//           </h1>

//           {/* Responsive Scroll Wrapper */}
//           <div className="w-full overflow-x-auto">
//             <div className="min-w-[600px]">
//               <DataGrid
//                 rows={rows}
//                 columns={columns}
//                 pageSize={10}
//                 disableSelectionOnClick
//                 autoHeight
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AllProducts;