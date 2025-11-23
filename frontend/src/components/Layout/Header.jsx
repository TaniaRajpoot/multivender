import React, { useState } from "react";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
// import {productData} from "../../static/data"
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { categoriesData, productData } from "../../static/data";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { CgProfile } from "react-icons/cg";
import {useSelector} from "react-redux"
import { backend_url } from "../../server";
import Cart from "./cart/Cart"
import Wishlist from "../Wishlist/Wishlist"


const Header = ({ activeHeading }) => {
  const {isAuthenticated,user,} = useSelector((state) => state.user)
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(null);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishList] = useState(false) ;
console.log (user);



  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      productData &&
      productData.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );

    setSearchData(filteredProducts);
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  return (
    <>
      <div className={`${styles.section}`}>
        {/* <div className='hidden md:flex items-center justify-between h-[50px] my-[20px]'> */}
        <div className="flex items-center justify-between h-[50px] my-[20px]">
          <div>
            <Link to="/">
              <img
                src="https://shopo.quomodothemes.website/assets/images/logo.svg?utm_source=chatgpt.com"
                alt="Shopo Logo"
                style={{ width: "150px", height: "auto" }}
              />
            </Link>
          </div>
          {/* Search box */}
          <div className="w-[50%] relative">
            <input
              type="text"
              placeholder="Search Product...."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-[2px] rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {searchData && searchData.length !== 0 ? (
              <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4  ">
                {searchData &&
                  searchData.map((i, index) => {
                    const d = i.name;

                    const Product_name = d.replace(/\s+/g, "-");
                    return (
                      <Link to={`/product/${Product_name}`}>
                        <img
                          src={i.image_Url && i.image_Url[0]?.url} // Correct property and array access
                          alt=""
                          className="w-[40px] h-[40px] mr-[10px]"
                        />
                        <h1>{i.name}</h1>
                      </Link>
                    );
                  })}
              </div>
            ) : null}
          </div>

          <div className={`${styles.button}`}>
            <Link to="/seller">
              <h1 className="text-[#ffff] flex items-center">
                Become Seller <IoIosArrowForward className="ml-1" />
              </h1>
            </Link>
          </div>
        </div>
      </div>{" "}
      <div
  className={`${
    active ? "shadow-sm fixed top-0 left-0 z-10 w-full" : ""
  } transition hidden md:flex items-center justify-between bg-[#3321c8] h-[70px]`}
>

        <div
          className={`${styles.section} relative ${styles.noramlFlex} justify-between`}
        >
          {/* Categories*/}
          <div onClick={()=> setDropDown(!dropDown)}>
            <div className="relative h-[60px] mt-[10px] w-[270px] hidden lg:block">
              <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
              <button
                className={` h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md `}
              >
                All Categories
              </button>
              <IoIosArrowDown
                size={20}
                className="absolute right-2 top-2 cursor-pointer "
                onClick={() => setDropDown(!dropDown)}
              />
              {dropDown ? (
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              ) : null}
            </div>
          </div>
          {/* nav items */}
          <div className={`${styles.noramlFlex}`}>
            <Navbar active={activeHeading} />
          </div>
          <div className="flex">
            <div className={`${styles.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px]"
             onClick={() => setOpenWishList(true)}
              >
                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center  ">
                  0
                </span>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px]"
               onClick={()=> setOpenCart(true)}>
                <AiOutlineShoppingCart
                  size={30}
                  color="rgb(255 255 255 / 83%)"
                />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center  ">
                  1
                </span>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px]">
               {isAuthenticated ? (
                  <Link to = "/profile">
                    <img src={`${backend_url}${user?.avatar}`} className="w-[35px] h-[35px] rounded-full " alt="" />
                  </Link>
                ) : (
                   <Link to="/login">
                  <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                </Link>
                )
              }
              </div>
            </div>


            {/* cart pop up  */}
            {
              openCart ? (
                <Cart setOpenCart= {setOpenCart} />
              ) : null 
            }


            {/* wishlist  pop up  */}
            {
              openWishlist ? (
                <Wishlist setOpenWishList= {setOpenWishList} />
              ) : null 
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;


