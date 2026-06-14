import React, { useEffect } from "react";
import ShopLogin from "../components/Shop/ShopLogin.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ShopLoginPage = () => {
  const { isAuthenticated, seller } = useSelector((state) => state.seller);
  const navigate = useNavigate();
  console.log("ShopLoginPage", seller);

  useEffect(() => {
    if (isAuthenticated && seller?._id) {
      navigate(`/shop/${seller._id}`);
    }
  }, [isAuthenticated, seller]);

  return <ShopLogin />;
};

export default ShopLoginPage;
