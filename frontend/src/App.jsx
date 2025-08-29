import React from 'react'
import {BrowserRouter,Routes, Route} from 'react-router-dom'
import {LoginPage,SignupPage,ActivationPage} from './Routes.js';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'

const App = () => {
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