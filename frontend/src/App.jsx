import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ProductDetailsPage,
  ProductPage,
  BestSellingPage,
  EventsPage,
  FAQPage,
  ProfilePage,
  ShopCreatePage,
  SellerActivationPage,
  ShopLoginPage
} from "./Routes.js";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Store from "./redux/store.js";
import { loadSeller, loadUser } from "./redux/actions/user.js";
import { useSelector } from "react-redux";
import ProtectedRoute from "./ProtectedRoute.jsx";
import {ShopHomePage} from "./ShopRoutes.js"
import SellerProtectedRoute from "./SelllerProtectedRoute.jsx";

// Create a new component for routes that can use useNavigate
const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const {  isSeller, seller } = useSelector((state) => state.seller);
  const navigate = useNavigate(); // ✅ Now inside BrowserRouter

  useEffect(() => {
    if (isSeller && seller?._id) {
      navigate(`/seller/${seller._id}`);
    }
  }, [isSeller, seller, navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route
          path="/activation/:activationToken"
          element={<ActivationPage />}
        />
        <Route
          path="/seller/activation/:activationToken"
          element={<SellerActivationPage />}
        />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product/:name" element={<ProductDetailsPage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Shop Route  */}
        <Route path="/shop-create" element={<ShopCreatePage />} />
        <Route path="/shop-login" element={<ShopLoginPage />} />
        <Route path="/shop/:id" element={
          <SellerProtectedRoute
          isSeller={isSeller}>
            <ShopHomePage />
          </SellerProtectedRoute>
        } />
      </Routes>
      <ToastContainer />
    </>
  );
};

const App = () => {
  const { loading } = useSelector((state) => state.user);
  const { isLoading } = useSelector((state) => state.seller);

  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
  }, []);

  return (
    <>
      {loading || isLoading ? null : (
        <BrowserRouter>
          <AppRoutes /> {/* ✅ Routes component is now inside BrowserRouter */}
        </BrowserRouter>
      )}
    </>
  );
};

export default App;