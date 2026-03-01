import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import { toast } from "react-toastify";

const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const { products } = useSelector((state) => state.product);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    setIsLoading(true);
    axios
      .get(`${server}/shop/get-shop-info/${id}`)
      .then((res) => {
        setData(res.data.shop);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [dispatch, id]);

  const logoutHandler = async () => {
    try {
      await axios.get(`${server}/shop/logout`, { withCredentials: true });
      toast.success("Logout successful");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const totalReviewsLength = products?.reduce((acc, product) => acc + (product.reviews?.length || 0), 0) || 0;
  const totalRatings = products?.reduce((acc, product) => acc + (product.reviews?.reduce((sum, review) => sum + review.rating, 0) || 0), 0) || 0;
  const averageRating = totalReviewsLength > 0 ? (totalRatings / totalReviewsLength).toFixed(1) : "0.0";

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="bg-white/40 backdrop-blur-md rounded-[48px] border border-white p-8 md:p-10 shadow-soft sticky top-24">
          <div className="w-full pb-6 border-b border-[#16697A]/10">
            <div className="w-full flex items-center justify-center">
              <div className="relative group">
                <img
                  src={data.avatar?.url || "/placeholder.png"}
                  alt="profile"
                  className="w-40 h-40 object-cover rounded-[40px] shadow-2xl border-4 border-white transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg" />
              </div>
            </div>
            <h3 className="text-center mt-4 text-2xl font-[700] text-[#16697A] tracking-tight font-display italic">{data.name}</h3>
            <p className="text-center mt-4 text-[#6B7280] font-[500] leading-relaxed px-2 font-sans">
              {data.description}
            </p>
          </div>

          <div className="space-y-8 pt-6">
            <div>
              <h5 className="text-[10px] font-black text-[#489FB5] uppercase tracking-[0.3em] mb-2 font-sans">Address</h5>
              <h4 className="text-[#16697A] font-[600] text-sm leading-snug font-sans">{data.address}</h4>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h5 className="text-[10px] font-black text-[#489FB5] uppercase tracking-[0.3em] mb-2 font-sans">Total Products</h5>
                <h4 className="text-[#16697A] font-[700] font-sans">{products?.length || 0}</h4>
              </div>
              <div>
                <h5 className="text-[10px] font-black text-[#489FB5] uppercase tracking-[0.3em] mb-2 font-sans">Joined On</h5>
                <h4 className="text-[#16697A] font-[700] font-sans">{data?.createdAt?.slice(0, 10)}</h4>
              </div>
            </div>

            <div>
              <h5 className="text-[10px] font-black text-[#489FB5] uppercase tracking-[0.3em] mb-2 font-sans">Shop Ratings</h5>
              <div className="flex items-center gap-2">
                <span className="text-[#FFA62B] text-lg font-[700] font-sans">{averageRating}/5</span>
              </div>
            </div>

            {isOwner && (
              <div className="space-y-4 pt-6">
                <Link to="/settings">
                  <button className="w-full h-14 bg-[#16697A] text-[#EDE7E3] font-[700] uppercase tracking-[0.1em] text-[13px] rounded-2xl hover:bg-[#FFA62B] transition-all shadow-lg font-sans">
                    Go Dashboard
                  </button>
                </Link>
                <button
                  onClick={logoutHandler}
                  className="w-full h-14 border border-[#16697A]/10 text-[#16697A]/60 font-[700] uppercase tracking-[0.1em] text-[13px] rounded-2xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all font-sans"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ShopInfo;