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
            <div className={`${styles.section} flex bg-[#EDE7E3]/30 py-12 min-h-screen`}>
                <div className='w-[60px] sm:w-[280px] md:w-[280px] lg:w-[280px] sticky top-24 h-fit'>
                    <ProfileSideBar active={active} setActive={setActive} />
                </div>
                <div className='flex-1 ml-4 sm:ml-10'>
                    <ProfileContent active={active} />
                </div>
            </div>
        </div>
    )
}

export default ProfilePage