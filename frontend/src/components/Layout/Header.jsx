import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
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
  const { isSeller } = useSelector((state) => state.seller);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const [mobileSearchData, setMobileSearchData] = useState(null);
  const [sticky, setSticky] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishList] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSearch = (val, mobile = false) => {
    const filtered = allProducts?.filter((p) => p.name.toLowerCase().includes(val.toLowerCase())) || [];
    if (mobile) {
      setMobileSearchTerm(val);
      setMobileSearchData(filtered);
    } else {
      setSearchTerm(val);
      setSearchData(filtered);
    }
  };

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 70);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const SearchResults = ({ data, onPick }) =>
    data?.length > 0 && (
      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
        {data.map((item, i) => (
          <Link key={i} to={`/product/${item._id}`} onClick={onPick} className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0">
            <img src={item.images?.[0]?.url} alt="" className="w-10 h-10 rounded object-cover" />
            <span className="text-sm text-gray-800">{item.name}</span>
          </Link>
        ))}
      </div>
    );

  return (
    <>
      <div className="hidden md:block bg-teal-900 text-teal-100 text-center text-xs py-2">
        Free shipping on orders over $99 · New products every week
      </div>

      {/* Desktop top bar */}
      <div className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="Shop" className="h-9" />
            <span className="font-bold text-lg text-teal-800">MultiVendor</span>
          </Link>

          <div className="flex-1 max-w-xl relative">
            <input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full h-10 pl-4 pr-10 rounded-lg border border-gray-300 text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 outline-none"
            />
            <AiOutlineSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <SearchResults data={searchData} onPick={() => { setSearchTerm(""); setSearchData(null); }} />
          </div>

          <Link to={isSeller ? "/dashboard" : "/shop-create"} className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
            {isSeller ? "My shop" : "Sell on our site"}
            <IoIosArrowForward size={14} />
          </Link>
        </div>
      </div>

      {/* Desktop nav */}
      <div className={`hidden md:block bg-teal-700 text-white ${sticky ? "fixed top-0 left-0 right-0 z-50 shadow-md" : ""}`}>
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropDown(!dropDown)}
              className="flex items-center gap-2 bg-white text-teal-800 rounded-lg px-3 py-1.5 text-sm font-semibold"
            >
              <BiMenuAltLeft size={20} />
              Categories
              <IoIosArrowDown size={14} className={dropDown ? "rotate-180" : ""} />
            </button>
            {dropDown && (
              <div className="absolute top-full left-0 mt-1 z-50">
                <DropDown categoriesData={categoriesData} setDropDown={setDropDown} />
              </div>
            )}
          </div>
          <Navbar active={activeHeading} />
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setOpenWishList(true)} className="relative p-1" aria-label="Wishlist">
              <AiOutlineHeart size={22} />
              {wishlist?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button type="button" onClick={() => setOpenCart(true)} className="relative p-1" aria-label="Cart">
              <AiOutlineShoppingCart size={22} />
              {cart?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                  {cart.length}
                </span>
              )}
            </button>
            {isAuthenticated ? (
              <Link to="/profile">
                <img src={user?.avatar?.url || user?.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
              </Link>
            ) : (
              <Link to="/login" className="text-sm font-medium hover:underline">Sign in</Link>
            )}
          </div>
        </div>
      </div>
      {sticky && <div className="hidden md:block h-12" />}

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-teal-700 text-white flex items-center justify-between px-4 shadow">
        <button type="button" onClick={() => setSidebarOpen(true)} aria-label="Menu">
          <BiMenuAltLeft size={26} />
        </button>
        <Link to="/">
          <img src="/logo.png" alt="" className="h-8" />
        </Link>
        <button type="button" onClick={() => setOpenCart(true)} className="relative" aria-label="Cart">
          <AiOutlineShoppingCart size={24} />
          {cart?.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-orange-500 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>
      <div className="md:hidden h-14" />

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[min(85vw,320px)] bg-white flex flex-col shadow-xl">
            <div className="h-14 bg-teal-700 text-white flex items-center justify-between px-4">
              <span className="font-semibold">Menu</span>
              <button type="button" onClick={() => setSidebarOpen(false)}><RxCross1 size={22} /></button>
            </div>
            <div className="p-4 border-b">
              {isAuthenticated ? (
                <Link to="/profile" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3">
                  <img src={user?.avatar?.url || user?.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">View profile</p>
                  </div>
                </Link>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" onClick={() => setSidebarOpen(false)} className="flex-1 text-center py-2 rounded-lg bg-teal-700 text-white text-sm font-semibold">Sign in</Link>
                  <Link to="/sign-up" onClick={() => setSidebarOpen(false)} className="flex-1 text-center py-2 rounded-lg border border-teal-700 text-teal-700 text-sm font-semibold">Sign up</Link>
                </div>
              )}
            </div>
            <div className="p-4 border-b relative">
              <input
                type="search"
                placeholder="Search..."
                value={mobileSearchTerm}
                onChange={(e) => handleSearch(e.target.value, true)}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm"
              />
              <SearchResults data={mobileSearchData} onPick={() => { setSidebarOpen(false); setMobileSearchTerm(""); setMobileSearchData(null); }} />
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <Navbar active={activeHeading} />
            </div>
            <div className="p-4 border-t space-y-2">
              <button type="button" onClick={() => { setOpenWishList(true); setSidebarOpen(false); }} className="w-full flex items-center gap-2 py-2 text-sm font-medium text-gray-700">
                <AiOutlineHeart size={20} /> Wishlist
              </button>
              <Link to={isSeller ? "/dashboard" : "/shop-create"} onClick={() => setSidebarOpen(false)} className="block text-center py-3 rounded-lg bg-orange-500 text-white text-sm font-semibold">
                {isSeller ? "Shop dashboard" : "Start selling"}
              </Link>
            </div>
          </div>
        </div>
      )}

      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishList={setOpenWishList} />}
    </>
  );
};

export default Header;
