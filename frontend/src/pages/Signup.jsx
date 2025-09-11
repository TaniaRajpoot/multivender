import React, { useEffect } from 'react'
import Signup from '../components/Signup/Signup' // Import the component with a different name or correct path
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const SignupPage = () => {
  
      const {isAuthenticated} = useSelector((state) => state.user)
    const navigate = useNavigate()

  useEffect(()=>{
    if (isAuthenticated === true) {
      navigate("/")
    }

  },[])
  return (
    <div>
        <Signup/>  {/* Now this refers to the imported component, not itself */}
    </div>
  )
}

export default SignupPage