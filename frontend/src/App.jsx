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
} from "./routes/Routes.js";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Store from "./redux/store.js";
import { loadUser } from "./redux/actions/user.js";
import { loadSeller } from "./redux/actions/seller.js";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { ShopHomePage, ShopDashboardPage,ShopCreateProduct, ShopAllProducts,ShopCreateEvent,ShopAllEvents ,ShopAllCoupons,ShopPreviewPage} from "./routes/ShopRoutes.js";
import SellerProtectedRoute from "./routes/SelllerProtectedRoute.jsx";
import { Navigate } from "react-router-dom";


// Create a new component for routes that can use useNavigate
const AppRoutes = () => {


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
            <ProtectedRoute >
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        

        {/* Shop Route  */}
        <Route path="*" element={<Navigate to="/shop-login" replace />} />

        <Route path="/shop" element={<ShopHomePage />} />
        <Route path="/shop-create" element={<ShopCreatePage />} />
        <Route path="/shop-login" element={<ShopLoginPage />} />
        <Route path="/shop/:id" element={<ShopHomePage />} />
        {/* <Route path="/shop/preview/:id" element={<ShopPreviewPage />} /> */}
        <Route
          path="/dashboard"
          element={
            <SellerProtectedRoute>
              <ShopDashboardPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-product"
          element={
            <SellerProtectedRoute>
          <ShopCreateProduct/>
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-products"
          element={
            <SellerProtectedRoute>
          <ShopAllProducts/>
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-event"
          element={
            <SellerProtectedRoute>
          <ShopCreateEvent/>
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-events"
          element={
            <SellerProtectedRoute>
          <ShopAllEvents/>
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-coupons"
          element={
            <SellerProtectedRoute>
          <ShopAllCoupons/>
            </SellerProtectedRoute>
          }
        />

      </Routes>

      <ToastContainer />
    </>
  );
};

const App = () => {


  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
  }, []);

  return (
    <>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </>
  );
};

export default App;