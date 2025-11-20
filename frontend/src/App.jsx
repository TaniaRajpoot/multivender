import React from 'react'
import {BrowserRouter,Routes, Route} from 'react-router-dom'
import {LoginPage,SignupPage,ActivationPage,HomePage,ProductDetailsPage,ProductPage,BestSellingPage,EventsPage,FAQPage,ProfilePage} from './Routes.js';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import { useEffect } from 'react';
import Store from './redux/store.js';
import { loadUser } from './redux/actions/user.js';
import { useSelector } from 'react-redux';


const App = () => {
  const {loading} = useSelector((state) => state.user)


  useEffect(()=>{
    Store.dispatch(loadUser());
 
  },[])
  return (
    <>
    {
      loading ? 
      null 
      : 
      (
           <BrowserRouter>
    <Routes>
    <Route path='/' element={<HomePage/>} />
    <Route path='/login' element={<LoginPage/>} />
    <Route path='/sign-up' element={<SignupPage/>} />
    <Route path='/activation/:activationToken' element={<ActivationPage/>} />
    <Route path = "/products" element={ <ProductPage />} />
    <Route path="/product/:name" element={<ProductDetailsPage />} />
    <Route path = "/best-selling" element={ <BestSellingPage />} />
    <Route path = "/events" element={ <EventsPage/>} />
    <Route path = "/faq" element={ <FAQPage/>} />
    {/* <Route path = "/checkout" element={ <CheckoutPage/>} />
    <Route path = "/payment" element={ <PaymentPage/>} />
    <Route path = "/order/success/:id" element={ <OrderSuccessPage/>} /> */}
    <Route path = "profile" element={ <ProfilePage/>} />

    </Routes>
     <ToastContainer 
      />
    </BrowserRouter>
      )
    }
    </>
 
  )
}


export default App 