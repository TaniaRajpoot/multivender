<<<<<<< HEAD
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
=======
// ...existing code...
import React, { useEffect } from 'react'
import ShopLogin from '../components/Shop/ShopLogin.jsx'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


const ShopLoginPage = () => {
   const {isAuthenticated} = useSelector((state) => state.user)
    const navigate = useNavigate()
    const {isSeller, isLoading} = useSelector((state) => state.seller)

  useEffect(() => {
    if (!isLoading && isSeller === true) {
      navigate("/dashboard");
    }
  }, [isLoading, isSeller, navigate]);

  return (
    <div><ShopLogin/></div>
  )
}

export default ShopLoginPage
// ...existing code...
>>>>>>> ae41d90a519fe657bef96d7050b7b90af2b328bd
