import React from 'react';
import { navItems } from '../../static/data';
import { Link } from 'react-router-dom';

const Navbar = ({ active }) => {
  return (
    <nav className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto">
      {navItems && navItems.map((item, index) => {
        const isActive = active === index + 1;
        return (
          <Link
            key={index}
            to={item.url}
            className="group relative px-8 md:px-4 flex items-center whitespace-nowrap w-full md:w-auto"
            style={{ height: '44px' }}
          >
            {/* Animated bottom indicator - Only on desktop */}
            <span style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              height: '3px',
              borderRadius: '3px 3px 0 0',
              backgroundColor: '#FFFFFF',
              width: isActive ? '40%' : '0%',
              transition: 'all 0.3s ease',
            }}
              className="hidden md:block group-hover:!w-[40%]"
            />

            <span
              style={{
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                fontFamily: "'DM Sans', sans-serif",
                color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.85)',
                transition: 'all 0.3s ease',
              }}
              className={`group-hover:!text-white ${isActive ? "text-white" : "text-[#16697A]/80 md:text-white/80"}`}
            >
              {item.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;