
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { backend_url, server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const { seller } = useSelector((state) => state.seller);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { products } = useSelector((state) => state.products);

  // useEffect(() => {
  //   const fetchShopInfo = async () => {
  //     try {
  //       setIsLoading(true);
  //       dispatch(getAllProductsShop(id));
  //       const res = await axios.get(`${server}/shop/get-shop-info/${id}`);
  //       setData(res.data.shop);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error(error);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchShopInfo();
  // }, [dispatch, id]);


const logoutHandler = async () => {
  try {
    await axios.get(`${server}/shop/logout`, {
      withCredentials: true,
    });

    toast.success("Logout successful");

    // ✅ clear redux seller state
    dispatch({ type: "sellerLogout" });

    // ✅ redirect to login
    navigate("/shop-login", { replace: true });

  } catch (error) {
    toast.error("Failed to logout");
    console.log(error);
  }
};




  // // Calculate average rating safely
  // const totalReviewsLength =
  //   products?.reduce((acc, product) => acc + product.reviews.length, 0) || 0;
  // const totalRatings =
  //   products?.reduce(
  //     (acc, product) =>
  //       acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
  //     0
  //   ) || 0;
  // const averageRating = totalReviewsLength ? (totalRatings / totalReviewsLength).toFixed(1) : 0;

  // if (isLoading) return <Loader />;

  return (
    <div className="w-full">
      {/* Shop Info */}
      <div className="w-full py-5 flex flex-col items-center">
        <img
          src={`${backend_url}${seller?.avatar}`}
          alt={data.name}
          className="w-[150px] h-[150px] object-cover rounded-full"
        />
        <h3 className="text-center py-2 text-[20px]">{seller?.name}</h3>
        <p className="text-[16px] text-[#000000a6] p-[10px] text-center">{data.description}</p>
      </div>

      {/* Shop Details */}
      <div className="p-3">
        <h5 className="font-[600]">Address</h5>
        <h4 className="text-[#000000a6]">{seller?.address}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Phone Number</h5>
        <h4 className="text-[#000000a6]">{seller?.phoneNumber}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Total Products</h5>
        <h4 className="text-[#000000a6]">5</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Shop Ratings</h5>
        <h4 className="text-[#000000b0]">4/5</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Joined On</h5>
        <h4 className="text-[#000000b0]">{data?.createdAt?.slice(0, 10)}</h4>
      </div>

      {/* Owner Controls */}
      {isOwner && (
        <div className="py-3 px-4 flex flex-col gap-2">
          <Link to="/settings">
            <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}>
              <span className="text-white">Edit Shop</span>
            </div>
          </Link>
          <div
            className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
            onClick={logoutHandler}
          >
            <span className="text-white">Log Out</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopInfo;