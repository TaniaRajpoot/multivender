import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import styles from "../../styles/styles"; 
import { toast } from "react-toastify";

const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const { products } = useSelector((state) => state.product);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchShopData = async () => {
      setIsLoading(true);
      try {
        if (isOwner) {
          // First get the seller info to get their shop ID
          const sellerResponse = await axios.get(`${server}/shop/getSeller`, {
            withCredentials: true,
          });
          const sellerId = sellerResponse.data.seller._id;
          
          // Then fetch shop info using the seller's ID
          const shopResponse = await axios.get(
            `${server}/shop/get-shop-info/${sellerId}`,
            { withCredentials: true }
          );
          setData(shopResponse.data.shop);
          dispatch(getAllProductsShop(sellerId));
        } else {
          if (!id) {
            setIsLoading(false);
            return;
          }
          const response = await axios.get(
            `${server}/shop/get-shop-info/${id}`,
            { withCredentials: true }
          );
          setData(response.data.shop);
          dispatch(getAllProductsShop(id));
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading shop:", err);
        toast.error(err.response?.data?.message || "Failed to load shop info");
        setIsLoading(false);
      }
    };

    fetchShopData();
  }, [dispatch, id, isOwner]);

  const logoutHandler = async () => {
    try {
      await axios.get(`${server}/shop/logout`, { withCredentials: true });
      toast.success("Logout successful");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to logout");
      console.log(error);
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + (product.reviews?.length || 0), 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + (product.reviews?.reduce((sum, review) => sum + review.rating, 0) || 0),
      0
    );

  const averageRating = totalRatings / totalReviewsLength || 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="w-full py-5">
            <div className="w-full flex item-center justify-center">
              <img
                src={data.avatar?.url || "https://via.placeholder.com/150"}
                alt="profile"
                className="w-[150px] h-[150px] object-cover rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
            <h3 className="text-center py-2 text-[20px]">{data.name || "Shop Name"}</h3>
            <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
              {data.description || "No description available"}
            </p>
          </div>
          <div className="p-3">
            <h5 className="font-semibold">Address</h5>
            <h4 className="text-[#000000a6]">{data.address || "N/A"}</h4>
          </div>
          <div className="p-3">
            <h5 className="font-semibold">Phone Number</h5>
            <h4 className="text-[#000000a6]">{data.phoneNumber || "N/A"}</h4>
          </div>
          <div className="p-3">
            <h5 className="font-semibold">Total Products</h5>
            <h4 className="text-[#000000a6]">{products?.length || 0}</h4>
          </div>
          <div className="p-3">
            <h5 className="font-semibold">Shop Ratings</h5>
            <h4 className="text-[#000000b0]">{averageRating.toFixed(1)}/5</h4>
          </div>
          <div className="p-3">
            <h5 className="font-semibold">Joined On</h5>
            <h4 className="text-[#000000b0]">
              {data?.createdAt?.slice(0, 10) || "N/A"}
            </h4>
          </div>
          {isOwner && (
            <div className="py-3 px-4">
              <Link to="/settings">
                <div
                  className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                >
                  <span className="text-white">Edit Shop</span>
                </div>
              </Link>
              <div
                className={`${styles.button} !w-full bg-red-700 !h-[42px] !rounded-[5px] cursor-pointer`}
                onClick={logoutHandler}
              >
                <span className="text-white">Log Out</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ShopInfo;