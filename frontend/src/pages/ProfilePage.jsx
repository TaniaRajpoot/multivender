import React, { useState } from 'react'
import Header from '../components/Layout/Header'
import styles from '../styles/styles'
import ProfileSideBar from "../components/Profile/ProfileSideBar"
import ProfileContent from "../components/Profile/ProfileContent"


const ProfilePage = () => {
    const [active, setActive] = useState(1);

    
  return (
    <div>
        <Header />
        <div className={`${styles.section} flex bg-[#f5f5f5] py-10`}>
            <div className='w-[60px] sm:w-[250px] md:w-[250px] lg:w-[250px] sticky top-10 h-fit'>
                <ProfileSideBar active={active} setActive={setActive} />
            </div>
            <div className='flex-1 ml-4 sm:ml-8 md:ml-8 lg:ml-8'>
                <ProfileContent active={active} />
            </div>
        </div>
    </div>
  )
}

export default ProfilePage