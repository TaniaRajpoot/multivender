import React from 'react'
import {BrowserRouter,Routes, Route} from 'react-router-dom'
import {LoginPage,SignupPage,ActivationPage} from './Routes.js';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify'
import { useEffect } from 'react';
import axios from 'axios';
import { server } from './server.js';

const App = () => {
  useEffect(()=>{
    axios.get(`${server}/user/getuser`,{withCredentials:true}).then((res)=>{
      toast.success(res.data.message)
    }).catch((err)=>{
      toast.error(err.response.data.message)
    })
  },[])
  return (
    
    <BrowserRouter>
    <Routes>
    <Route path='/login' element={<LoginPage/>} />
    <Route path='/sign-up' element={<SignupPage/>} />
    <Route path='/activation/:activationToken' element={<ActivationPage/>} />
    </Routes>

     <ToastContainer 
        
      />
    </BrowserRouter>
  )
}

export default App 