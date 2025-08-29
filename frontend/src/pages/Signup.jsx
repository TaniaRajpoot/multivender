import React from 'react'
import Signup from '../components/Signup/Signup' // Import the component with a different name or correct path

const SignupPage = () => {  // Rename the page component
  return (
    <div>
        <Signup/>  {/* Now this refers to the imported component, not itself */}
    </div>
  )
}

export default SignupPage