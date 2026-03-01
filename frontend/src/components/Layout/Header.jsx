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

  React.useEffect(() => {
    const handleScroll = () => setActive(window.scrollY > 70);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const IconBadge = ({ count, onClick, icon }) => (
    <div className="relative cursor-pointer" onClick={onClick}>
      {icon}
      <span className="absolute -top-1.5 -right-1.5 rounded-full bg-[#FFA62B] min-w-[18px] h-[18px] flex items-center justify-center text-white text-[10px] font-bold px-0.5">
        {count || 0}
      </span>
    </div>
  );

  return (
    <>
      {/* ── Announcement Bar ── */}
      <div className="hidden md:flex items-center justify-center py-1 text-[9px] font-[700] tracking-[0.2em] uppercase bg-[#0D3D47] text-[#82C0CC] font-sans">
        ✦ &nbsp; Free Shipping Over $99 &nbsp; · &nbsp; New Arrivals &nbsp; ✦
      </div>

      {/* ── Desktop Top Bar ── */}
      <div className={`${styles.section} hidden md:block bg-[#EDE7E3]`}>
        <div className="flex items-center justify-between h-[56px]">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img
              src="/logo.png"
              alt="Crown Market"
              className="w-[90px] h-auto opacity-90 hover:opacity-100 transition-opacity"
            />
          </Link>
          {/* Search Box */}
          <div className="w-[40%] relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-10 w-full pl-5 pr-12 border border-[#16697A]/20 rounded-full text-sm font-sans focus:outline-none focus:border-[#16697A] transition-all bg-white/50 backdrop-blur-sm placeholder:text-[#16697A]/40"
            />
            <AiOutlineSearch
              size={18}
              className="absolute right-4 top-[11px] text-[#16697A] cursor-pointer hover:scale-110 transition-transform"
            />
            {/* Search Dropdown */}
            {searchData && searchData.length > 0 && (
              <div className="absolute top-12 left-0 w-full bg-white border border-[#82C0CC]/40 rounded-xl shadow-xl z-50 max-h-[50vh] overflow-y-auto">
                {searchData.map((item, index) => (
                  <Link
                    key={index}
                    to={`/product/${item._id}`}
                    onClick={() => { setSearchTerm(""); setSearchData(null); }}
                  >
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#EDE7E3] transition-colors border-b border-gray-100 last:border-0">
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
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-[1px] bg-[#FFA62B] group-hover:w-12 transition-all" />
              <span className="text-[11px] font-[700] uppercase tracking-[0.15em] text-[#16697A] group-hover:text-[#FFA62B] transition-colors font-sans">
                {isSeller ? "Go Dashboard" : "Become Vendor"}
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Desktop Navigation Bar ── */}
      <div
        className={`${active ? "shadow-lg fixed top-0 left-0 z-[100]" : ""
          } hidden md:flex items-center justify-between h-[44px] w-full transition-shadow bg-[#16697A]`}
      >
        <div className={`${styles.section} flex items-center justify-between w-full`}>
          {/* Categories Dropdown Container */}
          <div className="relative h-[50px] w-auto flex items-end">
            <button
              onClick={() => setDropDown(!dropDown)}
              className={`
                flex items-center gap-2.5 min-w-[200px] h-[36px] px-5 text-[10px] font-[700] uppercase tracking-[0.15em] transition-all duration-500 rounded-t-[16px] border-x border-t font-sans
                ${dropDown ? "bg-white text-[#16697A] border-white shadow-2xl" : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40"}
              `}
            >
              <div className="relative">
                <BiMenuAltLeft size={20} className={dropDown ? "text-[#16697A]" : "text-[#FFA62B]"} />
                {dropDown && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#FFA62B] rounded-full" />}
              </div>
              All Categories
              <IoIosArrowDown
                size={14}
                className={`ml-auto transition-transform duration-500 ${dropDown ? "rotate-180" : ""}`}
              />
            </button>

            {dropDown && (
              <div className="absolute top-[36px] left-0 z-[1000]">
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
            <IconBadge
              count={wishlist?.length}
              onClick={() => setOpenWishList(true)}
              icon={<AiOutlineHeart size={24} color="rgba(255,255,255,0.9)" />}
            />
            <IconBadge
              count={cart?.length}
              onClick={() => setOpenCart(true)}
              icon={<AiOutlineShoppingCart size={24} color="rgba(255,255,255,0.9)" />}
            />
            <div className="cursor-pointer">
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={user?.avatar?.url || user?.avatar}
                    className="w-[32px] h-[32px] rounded-full object-cover border-2 border-[#FFA62B] hover:border-white transition-colors"
                    alt={user?.name}
                  />
                </Link>
              ) : (
                <Link to="/login">
                  <CgProfile size={26} color="rgba(255,255,255,0.9)" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Header ── */}
      <div
        className={`${active ? "shadow-md" : ""
          } w-full h-[52px] fixed bg-[#16697A] z-50 top-0 left-0 md:hidden flex items-center justify-between px-4`}
      >
        <button onClick={() => setOpen(true)} className="p-1">
          <BiMenuAltLeft size={28} className="text-white" />
        </button>
        <Link to="/">
          <img src="/logo.png" alt="Crown Market" className="h-8 object-contain" />
        </Link>
        <IconBadge
          count={cart?.length}
          onClick={() => setOpenCart(true)}
          icon={<AiOutlineShoppingCart size={26} className="text-white" />}
        />
      </div>

      {/* Mobile spacer */}
      <div className="h-[52px] md:hidden" />

      {/* ── Mobile Sidebar ── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-[200] md:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="fixed top-0 left-0 w-[72%] max-w-[300px] h-full bg-[#EDE7E3] z-[201] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between px-4 py-4 bg-[#16697A]">
              <img src="/logo.png" alt="Crown Market" className="h-8 object-contain" />
              <button onClick={() => setOpen(false)} className="p-1">
                <RxCross1 size={22} className="text-white" />
              </button>
            </div>

            {/* Wishlist row */}
            <div
              className="flex items-center px-4 py-3 border-b border-[#82C0CC]/30 cursor-pointer"
              onClick={() => { setOpenWishList(true); setOpen(false); }}
            >
              <div className="relative">
                <AiOutlineHeart size={24} className="text-[#16697A]" />
                <span className="absolute -top-1.5 -right-1.5 rounded-full bg-[#FFA62B] min-w-[16px] h-[16px] flex items-center justify-center text-white text-[10px] font-bold">
                  {wishlist?.length || 0}
                </span>
              </div>
              <span className="ml-3 text-sm font-semibold text-[#16697A]">My Wishlist</span>
            </div>

            {/* Mobile Search */}
            <div className="px-4 py-4 relative border-b border-[#82C0CC]/30">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search products..."
                  value={mobileSearchTerm}
                  onChange={handleMobileSearchChange}
                  className="h-10 w-full pl-3 pr-10 border-2 border-[#489FB5] rounded-xl text-sm focus:outline-none bg-white text-gray-700"
                />
                <AiOutlineSearch size={18} className="absolute right-3 top-[11px] text-[#489FB5]" />
              </div>
              {mobileSearchData && mobileSearchData.length > 0 && (
                <div className="absolute left-4 right-4 top-[70px] bg-white border border-[#82C0CC]/40 rounded-xl shadow-xl z-10 max-h-[40vh] overflow-y-auto">
                  {mobileSearchData.map((item, index) => (
                    <Link
                      key={index}
                      to={`/product/${item._id}`}
                      onClick={() => { setOpen(false); setMobileSearchTerm(""); setMobileSearchData(null); }}
                    >
                      <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#EDE7E3] border-b border-gray-100 last:border-0">
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
            <div className="px-4 pb-4 border-b border-[#82C0CC]/30">
              <Navbar active={activeHeading} />
            </div>

            {/* Become Seller */}
            <div className="px-4 py-5">
              <Link
                to={isSeller ? "/dashboard" : "/shop-create"}
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center justify-center gap-1.5 bg-[#FFA62B] hover:bg-[#e8941f] text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full transition-colors">
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
                    className="w-[48px] h-[48px] rounded-full object-cover border-[3px] border-[#FFA62B]"
                    alt={user?.name}
                  />
                  <span className="text-sm font-semibold text-[#16697A]">{user?.name}</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-[15px]">
                  <Link to="/login" onClick={() => setOpen(false)} className="text-[#16697A] hover:text-[#489FB5] font-semibold transition-colors">
                    Login
                  </Link>
                  <span className="text-[#82C0CC]">/</span>
                  <Link to="/sign-up" onClick={() => setOpen(false)} className="text-[#16697A] hover:text-[#489FB5] font-semibold transition-colors">
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