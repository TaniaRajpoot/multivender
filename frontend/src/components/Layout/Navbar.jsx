import React from 'react'
import styles from '../../styles/styles'
import { navItems } from '../../static/data'
import { Link } from 'react-router-dom'

const Navbar = ({ active }) => {
  return (
    <div className={`flex flex-col md:flex-row md:${styles.noramlFlex}`}>
      {navItems && navItems.map((i, index) => (
        <div className='flex' key={index}>
          <Link
            to={i.url}
            className={`${
              active === index + 1 
                ? "text-[#17dd1f]" 
                : "text-black md:text-white"
            } py-3 md:py-0 md:pb-[30px] font-medium px-6 cursor-pointer block w-full`}
          >
            {i.title}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Navbar;