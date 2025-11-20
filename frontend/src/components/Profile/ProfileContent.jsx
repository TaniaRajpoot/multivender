import React from 'react'
import { backend_url } from '../../server'
import { useSelector } from 'react-redux'

const ProfileContent = ({active}) => {
  const {user} = useSelector((state => state.user));
  console.log("Backend URL:", backend_url);
  console.log("Avatar URL:", user?.avatar?.url);

  


  return (
    <div className='w-full'>
      {/* Profile page  */}
      {
        active === 1 && (
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
  src={`${backend_url.replace(/\/$/, '')}/${encodeURIComponent(user?.avatar?.url?.replace(/^\//, ''))}`}
  alt="Profile"
  className="rounded-full w-32 h-32 object-cover"
/>

            </div>
          </div>
        )
      } 

    </div>
  )
}

export default ProfileContent