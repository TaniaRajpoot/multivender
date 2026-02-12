import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
  ShopLoginPage,
  OrderDetailsPage,
  TrackOrderPage,
  UserInbox,
} from "./routes/Routes.js";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Store from "./redux/store.js";
import { loadUser } from "./redux/actions/user.js";
import { loadSeller } from "./redux/actions/seller.js";
import { getAllProducts } from "./redux/actions/product.js";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx"; 
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx"; 
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import SellerProtectedRoute from "./routes/SelllerProtectedRoute.jsx";

import {
  ShopHomePage,
  ShopDashboardPage,
  ShopCreateProduct,
  ShopAllProducts,
  ShopCreateEvent,
  ShopAllEvents,
  ShopAllCoupons,
  ShopPreviewPage,
  ShopAllOrders,
  OrderDetails,
  ShopAllRefunds,
  ShopSettingsPage,
  ShopWithdrawMoneyPage,
  ShopInboxPage

} from "./routes/ShopRoutes.js";

import {
  AdminDashboardPage,
  AdminDashboardUsersPage,
  AdminDashboardSellersPage,
  AdminDashboardOrdersPage,
  AdminDashboardProductsPage,
  AdminDashboardEventsPage,
  AdminDashboardWithdrawPage
   } from "./routes/AdminRoute.js";
import { useSelector } from "react-redux";
import { BsShopWindow } from "react-icons/bs";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute.jsx";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/activation/:activationToken" element={<ActivationPage />} />
        <Route path="/seller/activation/:activationToken" element={<SellerActivationPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        
        {/* Protected User Routes */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/inbox"
          element={
            <ProtectedRoute>
              <UserInbox />
            </ProtectedRoute>
          }
        />
          <Route 
          path="/user/order/:id" 
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          } 
        />
          <Route 
          path="/user/track/order/:id" 
          element={
            <ProtectedRoute>
              <TrackOrderPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order/success"
          element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          }
        />

        {/* Shop Routes */}
        <Route path="/shop-login" element={<ShopLoginPage />} />
        <Route path="/shop-create" element={<ShopCreatePage />} />
        <Route path="/shop" element={<ShopHomePage isOwner={true} />} />
        <Route path="/shop/:id" element={<ShopHomePage isOwner={false} />} />
        <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />

        {/* Protected Seller Routes */}
        <Route 
          path="/dashboard" 
          element={
            <SellerProtectedRoute>
              <ShopDashboardPage />
            </SellerProtectedRoute>
          } 
        />
         <Route 
          path="/settings" 
          element={
            <SellerProtectedRoute>
              <ShopSettingsPage />
            </SellerProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard-create-product" 
          element={
            <SellerProtectedRoute>
              <ShopCreateProduct />
            </SellerProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard-products" 
          element={
            <SellerProtectedRoute>
              <ShopAllProducts />
            </SellerProtectedRoute>
          } 
        />
        <Route
          path="/dashboard-orders"
          element={
            <SellerProtectedRoute>
              <ShopAllOrders />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <SellerProtectedRoute>
              <OrderDetails />
            </SellerProtectedRoute>
          }
        />
        <Route 
          path="/dashboard-create-event" 
          element={
            <SellerProtectedRoute>
              <ShopCreateEvent />
            </SellerProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard-events" 
          element={
            <SellerProtectedRoute>
              <ShopAllEvents />
            </SellerProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard-refunds" 
          element={
            <SellerProtectedRoute>
              <ShopAllRefunds />
            </SellerProtectedRoute>
          } 
        />
          <Route 
            path="/dashboard-coupons" 
            element={
              <SellerProtectedRoute>
                <ShopAllCoupons />
              </SellerProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard-withdraw-money" 
            element={
              <SellerProtectedRoute>
                <ShopWithdrawMoneyPage />
              </SellerProtectedRoute>
            } 
          />

           <Route 
            path="/dashboard-messages" 
            element={
              <SellerProtectedRoute>
                <ShopInboxPage />
              </SellerProtectedRoute>
            } 
          />

          {/* Admin Routes */}
           <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin-users"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardUsersPage />
              </ProtectedAdminRoute>
            }
          />
             <Route
            path="/admin-sellers"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardSellersPage />
              </ProtectedAdminRoute>
            }
          />
           <Route
            path="/admin-orders"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardOrdersPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin-products"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardProductsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin-events"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardEventsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin-withdraw-request"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardWithdrawPage />
              </ProtectedAdminRoute>
            }
          />
          

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>


      <ToastContainer 
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

const App = () => {
  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    Store.dispatch(getAllProducts());
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;