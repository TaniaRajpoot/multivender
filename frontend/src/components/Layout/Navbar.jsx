import React from 'react'
import styles from '../../styles/styles'
import { navItems } from '../../static/data'
import { Link } from 'react-router-dom'

const Navbar = ({ active }) => {
  return (
    <div className={`flex flex-col md:flex-row md:${styles.noramlFlex} gap-2`}>
      {navItems && navItems.map((i, index) => (
        <div className='flex' key={index}>
          <Link
            to={i.url}
            className={`${active === index + 1
              ? "text-[#FFA62B] border-b-2 border-[#FFA62B]"
              : "text-[#EDE7E3]/70"
              } py-2 md:py-3 px-5 font-[600] text-[11px] uppercase tracking-[0.2em] font-sans hover:text-[#FFA62B] transition-all duration-300 block w-full whitespace-nowrap`}
          >
            {i.title}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Navbar;