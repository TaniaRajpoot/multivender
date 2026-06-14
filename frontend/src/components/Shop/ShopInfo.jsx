import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { logoutSeller } from "../../redux/actions/seller";
import { server } from "../../server";
import { toast } from "react-toastify";
import { ui } from "../../styles/theme";

const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const { products } = useSelector((state) => state.product);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
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
    }
  }, [dispatch, id]);

  const logoutHandler = async () => {
    await dispatch(logoutSeller());
    toast.success("Logout successful");
    window.location.href = "/shop-login";
  };

  const totalReviewsLength = products?.reduce((acc, product) => acc + (product.reviews?.length || 0), 0) || 0;
  const totalRatings = products?.reduce((acc, product) => acc + (product.reviews?.reduce((sum, review) => sum + review.rating, 0) || 0), 0) || 0;
  const averageRating = totalReviewsLength > 0 ? (totalRatings / totalReviewsLength).toFixed(1) : "0.0";

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={`${ui.card} ${ui.cardPadding} space-y-6 sticky top-24`}>
          <div className="flex flex-col items-center text-center pb-6 border-b border-gray-200">
            <div className="relative group mb-4">
              <img
                src={data.avatar?.url || "/placeholder.png"}
                alt="profile"
                className="w-28 h-28 object-cover rounded-xl border border-gray-200 shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{data.name}</h3>
            {data.description && (
              <p className="text-xs text-gray-500 mt-2 line-clamp-3 px-2 leading-relaxed">
                {data.description}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Address</span>
              <span className="text-sm font-medium text-gray-700 mt-0.5 block">{data.address}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Products</span>
                <span className="text-sm font-semibold text-gray-900 mt-0.5 block">{products?.length || 0}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Joined On</span>
                <span className="text-sm font-semibold text-gray-900 mt-0.5 block">{data?.createdAt?.slice(0, 10)}</span>
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Shop Rating</span>
              <span className="text-sm font-semibold text-teal-700 mt-0.5 block">{averageRating} / 5.0</span>
            </div>

            {isOwner && (
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <Link to="/settings" className="block w-full">
                  <button className={`${ui.btnPrimary} w-full py-2.5`}>
                    Shop Settings
                  </button>
                </Link>
                <button
                  onClick={logoutHandler}
                  className={`${ui.btnDanger} w-full py-2.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-500 hover:text-white transition`}
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