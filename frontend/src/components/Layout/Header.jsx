import React, { useState } from "react";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { categoriesData } from "../../static/data";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";
import Cart from "./cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { allProducts } = useSelector((state) => state.product);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const [mobileSearchData, setMobileSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishList] = useState(false);
  const [open, setOpen] = useState(false);
  const { isSeller } = useSelector((state) => state.seller);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  const handleMobileSearchChange = (e) => {
    const term = e.target.value;
    setMobileSearchTerm(term);
    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setMobileSearchData(filteredProducts);
  };

  // ✅ Fixed: moved scroll listener outside render to avoid stacking listeners
  React.useEffect(() => {
    const handleScroll = () => setActive(window.scrollY > 70);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const IconBadge = ({ count, onClick, icon }) => (
    <div className="relative cursor-pointer" onClick={onClick}>
      {icon}
      <span className="absolute -top-1.5 -right-1.5 rounded-full bg-[#3bc177] min-w-[18px] h-[18px] flex items-center justify-center text-white text-[10px] font-bold px-0.5">
        {count || 0}
      </span>
    </div>
  );

  return (
    <>
      {/* ── Desktop Top Bar ── */}
      <div className={`${styles.section} hidden md:block`}>
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img
              src="https://shopo.quomodothemes.website/assets/images/logo.svg"
              alt="Shopo Logo"
              style={{ width: "150px", height: "auto" }}
            />
          </Link>

          {/* Search Box */}
          <div className="w-[45%] relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-11 w-full pl-4 pr-12 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3321c8] transition-colors"
            />
            <AiOutlineSearch
              size={22}
              className="absolute right-3 top-[11px] text-gray-400 cursor-pointer hover:text-[#3321c8] transition-colors"
            />
            {/* Search Dropdown */}
            {searchData && searchData.length > 0 && (
              <div className="absolute top-12 left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-[50vh] overflow-y-auto">
                {searchData.map((item, index) => (
                  <Link
                    key={index}
                    to={`/product/${item._id}`}
                    onClick={() => { setSearchTerm(""); setSearchData(null); }}
                  >
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                      <img
                        src={item.images && item.images[0]?.url}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <p className="text-sm text-gray-700 line-clamp-1">{item.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Become Seller Button */}
          <Link to={isSeller ? "/dashboard" : "/shop-create"}>
            <div className="flex items-center gap-1.5 bg-[#3321c8] hover:bg-[#2a1aa0] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
              {isSeller ? "Go to Shop" : "Become Seller"}
              <IoIosArrowForward size={16} />
            </div>
          </Link>
        </div>
      </div>

      {/* ── Desktop Navigation Bar ── */}
      <div
        className={`${
          active ? "shadow-lg fixed top-0 left-0 z-[100]" : ""
        } hidden md:flex items-center justify-between bg-[#3321c8] h-[65px] w-full transition-shadow`}
      >
        <div className={`${styles.section} flex items-center justify-between w-full`}>
          {/* Categories Dropdown */}
          <div className="relative h-[65px] w-[240px] hidden lg:flex items-end">
            <button
              onClick={() => setDropDown(!dropDown)}
              className="flex items-center gap-2 w-full h-[48px] bg-white rounded-t-xl px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <BiMenuAltLeft size={22} className="text-[#3321c8]" />
              All Categories
              <IoIosArrowDown
                size={16}
                className={`ml-auto text-gray-500 transition-transform duration-200 ${dropDown ? "rotate-180" : ""}`}
              />
            </button>
            {/* ✅ Fixed: absolute top-[48px] forces dropdown BELOW the button */}
            {dropDown && (
              <div className="absolute top-[48px] left-0 w-full z-[999]">
                <DropDown categoriesData={categoriesData} setDropDown={setDropDown} />
              </div>
            )}
          </div>

          {/* Nav Links */}
          <div className="flex items-center">
            <Navbar active={activeHeading} />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5">
            {/* Wishlist */}
            <IconBadge
              count={wishlist?.length}
              onClick={() => setOpenWishList(true)}
              icon={<AiOutlineHeart size={26} color="rgba(255,255,255,0.85)" />}
            />

            {/* Cart */}
            <IconBadge
              count={cart?.length}
              onClick={() => setOpenCart(true)}
              icon={<AiOutlineShoppingCart size={26} color="rgba(255,255,255,0.85)" />}
            />

            {/* Profile */}
            <div className="cursor-pointer">
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={user?.avatar?.url || user?.avatar}
                    className="w-[36px] h-[36px] rounded-full object-cover border-2 border-white/40 hover:border-white transition-colors"
                    alt={user?.name}
                  />
                </Link>
              ) : (
                <Link to="/login">
                  <CgProfile size={28} color="rgba(255,255,255,0.85)" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Header ── */}
      <div
        className={`${
          active ? "shadow-md" : ""
        } w-full h-[65px] fixed bg-white z-50 top-0 left-0 md:hidden flex items-center justify-between px-4`}
      >
        {/* Hamburger */}
        <button onClick={() => setOpen(true)} className="p-1">
          <BiMenuAltLeft size={28} className="text-gray-700" />
        </button>

        {/* Logo */}
        <Link to="/">
          <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt="Shopo Logo"
            className="h-8 object-contain"
          />
        </Link>

        {/* Cart Icon */}
        <IconBadge
          count={cart?.length}
          onClick={() => setOpenCart(true)}
          icon={<AiOutlineShoppingCart size={26} className="text-gray-700" />}
        />
      </div>

      {/* Mobile spacer so content doesn't hide under fixed header */}
      <div className="h-[65px] md:hidden" />

      {/* ── Mobile Sidebar ── */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-[200] md:hidden" onClick={() => setOpen(false)}>
          <div
            className="fixed top-0 left-0 w-[72%] max-w-[300px] h-full bg-white z-[201] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div
                className="relative cursor-pointer"
                onClick={() => { setOpenWishList(true); setOpen(false); }}
              >
                <AiOutlineHeart size={26} className="text-gray-700" />
                <span className="absolute -top-1.5 -right-1.5 rounded-full bg-[#3bc177] min-w-[16px] h-[16px] flex items-center justify-center text-white text-[10px] font-bold">
                  {wishlist?.length || 0}
                </span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1">
                <RxCross1 size={22} className="text-gray-600" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="px-4 py-4 relative">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search products..."
                  value={mobileSearchTerm}
                  onChange={handleMobileSearchChange}
                  className="h-10 w-full pl-3 pr-10 border-2 border-[#3321c8] rounded-xl text-sm focus:outline-none"
                />
                <AiOutlineSearch size={18} className="absolute right-3 top-[11px] text-gray-400" />
              </div>
              {mobileSearchData && mobileSearchData.length > 0 && (
                <div className="absolute left-4 right-4 top-[70px] bg-white border border-gray-100 rounded-xl shadow-xl z-10 max-h-[40vh] overflow-y-auto">
                  {mobileSearchData.map((item, index) => (
                    <Link
                      key={index}
                      to={`/product/${item._id}`}
                      onClick={() => { setOpen(false); setMobileSearchTerm(""); setMobileSearchData(null); }}
                    >
                      <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                        <img
                          src={item.images && item.images[0]?.url}
                          alt={item.name}
                          className="w-9 h-9 rounded-lg object-cover shrink-0"
                        />
                        <p className="text-sm text-gray-700 line-clamp-2">{item.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Nav Links */}
            <div className="px-4 pb-4 border-b border-gray-100">
              <Navbar active={activeHeading} />
            </div>

            {/* Become Seller */}
            <div className="px-4 py-5">
              <Link
                to={isSeller ? "/dashboard" : "/shop-create"}
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center justify-center gap-1.5 bg-[#3321c8] text-white text-sm font-medium px-4 py-2.5 rounded-xl w-full">
                  {isSeller ? "Go to Shop" : "Become Seller"}
                  <IoIosArrowForward size={16} />
                </div>
              </Link>
            </div>

            {/* Profile / Auth */}
            <div className="px-4 pb-6 flex justify-center">
              {isAuthenticated ? (
                <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3">
                  <img
                    src={user?.avatar?.url || user?.avatar}
                    className="w-[48px] h-[48px] rounded-full object-cover border-[3px] border-[#3bc177]"
                    alt={user?.name}
                  />
                  <span className="text-sm font-semibold text-gray-700">{user?.name}</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-[15px] text-gray-600">
                  <Link to="/login" onClick={() => setOpen(false)} className="hover:text-[#3321c8] font-medium transition-colors">
                    Login
                  </Link>
                  <span className="text-gray-300">/</span>
                  <Link to="/sign-up" onClick={() => setOpen(false)} className="hover:text-[#3321c8] font-medium transition-colors">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart & Wishlist Popups */}
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishList={setOpenWishList} />}
    </>
  );
};

export default Header;