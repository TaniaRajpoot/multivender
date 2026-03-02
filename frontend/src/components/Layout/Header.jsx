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

const C = {
  teal: "#16697A",
  mid: "#489FB5",
  sky: "#82C0CC",
  cream: "#EDE7E3",
  orange: "#FFA62B",
  dark: "#0D3D47",
  white: "#FFFFFF",
  lightGray: "#F3F4F6",
};

const IconBadge = ({ count, onClick, icon }) => (
  <button
    onClick={onClick}
    style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: "4px", lineHeight: 0 }}
  >
    {icon}
    {count > 0 && (
      <span style={{
        position: "absolute", top: "-2px", right: "-4px",
        backgroundColor: C.orange, color: "#fff",
        fontSize: "9px", fontWeight: 700,
        minWidth: "16px", height: "16px",
        borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 3px",
        fontFamily: "'DM Sans', sans-serif",
        lineHeight: 1,
      }}>
        {count}
      </span>
    )}
  </button>
);

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
    const filtered = allProducts?.filter(p =>
      p.name.toLowerCase().includes(val.toLowerCase())
    ) || [];
    if (mobile) { setMobileSearchTerm(val); setMobileSearchData(filtered); }
    else { setSearchTerm(val); setSearchData(filtered); }
  };

  React.useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 70);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .cm-search-input:focus { outline: none; border-color: #16697A; }
        .cm-search-input::placeholder { color: rgba(22,105,122,0.4); }
        .cm-icon-btn { transition: opacity 0.2s; }
        .cm-icon-btn:hover { opacity: 0.75; }
        .cm-sidebar-link:hover { background: rgba(22,105,122,0.06); }
        .cm-vendor-btn:hover { background: #e8941f; }
        .cm-cat-btn:hover { background: rgba(255,255,255,0.18); }
      `}</style>

      {/* ── Announcement Bar ── */}
      <div style={{
        backgroundColor: C.dark,
        color: C.sky,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "30px",
        fontSize: "9px",
        letterSpacing: "0.2em",
        fontWeight: 700,
        textTransform: "uppercase",
        fontFamily: "'DM Sans', sans-serif",
        gap: "12px",
      }}
        className="hidden md:flex"
      >
        <span style={{ color: C.orange }}>✦</span>
        Free Shipping on Orders Over $99
        <span style={{ color: `rgba(130,192,204,0.4)` }}>·</span>
        New Arrivals Every Week
        <span style={{ color: C.orange }}>✦</span>
      </div>

      {/* ── Desktop Top Bar (Logo + Search + Vendor) ── */}
      <div
        className="hidden md:flex"
        style={{
          backgroundColor: C.white,
          borderBottom: `1px solid ${C.lightGray}`,
          height: "80px",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 max(24px, calc((100vw - 1200px)/2))",
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ flexShrink: 0 }} className="flex items-center gap-3">
          <img src="/logo.png" alt="Crown Market" style={{ height: "45px", objectFit: "contain" }} />
          <h1 style={{ color: C.teal, fontSize: "24px", fontWeight: 900, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
            CROWN<span style={{ color: C.orange }}>MARKET</span>
          </h1>
        </Link>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: "600px", margin: "0 40px", position: "relative" }}>
          <input
            type="text"
            placeholder="Search Product..."
            value={searchTerm}
            onChange={e => handleSearch(e.target.value)}
            className="cm-search-input"
            style={{
              width: "100%",
              height: "44px",
              border: `1.5px solid ${C.teal}33`,
              borderRadius: "8px",
              padding: "0 44px 0 18px",
              fontSize: "14px",
              fontFamily: "'DM Sans', sans-serif",
              backgroundColor: "#fff",
              color: C.dark,
            }}
          />
          <AiOutlineSearch
            size={20}
            style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", color: C.teal, opacity: 0.5, pointerEvents: "none" }}
          />
        </div>

        {/* Become Vendor Button */}
        <Link to={isSeller ? "/dashboard" : "/shop-create"}>
          <button style={{
            backgroundColor: C.orange,
            color: "#fff",
            padding: "10px 24px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
            className="hover:opacity-90 shadow-lg shadow-[#FFA62B]/20"
          >
            {isSeller ? "Dashboard" : "Become Seller"}
            <IoIosArrowForward size={14} />
          </button>
        </Link>
      </div>

      {/* ── Desktop Nav Bar ── */}
      <div
        className="hidden md:flex"
        style={{
          backgroundColor: C.teal,
          height: "56px",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 max(24px, calc((100vw - 1200px)/2))",
          position: sticky ? "fixed" : "relative",
          top: sticky ? 0 : "auto",
          left: 0, right: 0,
          zIndex: sticky ? 100 : "auto",
        }}
      >
        {/* Categories Button */}
        <div style={{ position: "relative", height: "56px", display: "flex", alignItems: "center" }}>
          <button
            onClick={() => setDropDown(!dropDown)}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "0 20px",
              height: "44px",
              backgroundColor: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: 600,
              color: C.teal,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <BiMenuAltLeft size={22} color={C.orange} />
            All Categories
            <IoIosArrowDown
              size={16}
              style={{
                marginLeft: "auto",
                transition: "transform 0.25s",
                transform: dropDown ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {dropDown && (
            <div style={{ position: "absolute", top: "56px", left: 0, zIndex: 300 }}>
              <DropDown categoriesData={categoriesData} setDropDown={setDropDown} />
            </div>
          )}
        </div>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <Navbar active={activeHeading} />
        </div>

        {/* Right Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <IconBadge
            count={wishlist?.length}
            onClick={() => setOpenWishList(true)}
            icon={<AiOutlineHeart size={24} color={C.white} />}
          />
          <IconBadge
            count={cart?.length}
            onClick={() => setOpenCart(true)}
            icon={<AiOutlineShoppingCart size={24} color={C.white} />}
          />

          {isAuthenticated ? (
            <Link to="/profile">
              <img
                src={user?.avatar?.url || user?.avatar}
                alt={user?.name}
                style={{
                  width: "32px", height: "32px",
                  borderRadius: "50%", objectFit: "cover",
                  border: `2px solid ${C.white}`,
                }}
              />
            </Link>
          ) : (
            <Link to="/login">
              <CgProfile size={26} color={C.white} />
            </Link>
          )}
        </div>
      </div>

      {/* ── Mobile Header ── */}
      <div
        className="md:hidden flex"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          height: "52px",
          backgroundColor: C.teal,
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          boxShadow: sticky ? "0 2px 12px rgba(13,61,71,0.2)" : "none",
        }}
      >
        <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", lineHeight: 0 }}>
          <BiMenuAltLeft size={26} style={{ color: "#fff" }} />
        </button>
        <Link to="/">
          <img src="/logo.png" alt="Crown Market" style={{ height: "30px", objectFit: "contain" }} />
        </Link>
        <IconBadge
          count={cart?.length}
          onClick={() => setOpenCart(true)}
          icon={<AiOutlineShoppingCart size={24} style={{ color: "#fff", display: "block" }} />}
        />
      </div>

      {/* Mobile spacer */}
      <div className="md:hidden" style={{ height: "52px" }} />

      {/* ── Mobile Sidebar ── */}
      {sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 200 }}
          onClick={() => setSidebarOpen(false)}
        >
          <div
            style={{
              position: "fixed", top: 0, left: 0, bottom: 0,
              width: "min(85%, 320px)",
              backgroundColor: C.white,
              overflowY: "auto",
              boxShadow: "10px 0 40px rgba(13,61,71,0.25)",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Sidebar header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 16px", height: "52px",
              backgroundColor: C.teal,
            }}>
              <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 900, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em" }}>MENU</h2>
              <button onClick={() => setSidebarOpen(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <RxCross1 size={18} style={{ color: "#fff" }} />
              </button>
            </div>

            {/* Profile row */}
            <div style={{ padding: "16px", borderBottom: `1px solid rgba(130,192,204,0.2)` }}>
              {isAuthenticated ? (
                <Link to="/profile" onClick={() => setSidebarOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
                  <img
                    src={user?.avatar?.url || user?.avatar}
                    alt={user?.name}
                    style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", border: `2.5px solid ${C.orange}` }}
                  />
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: C.teal, fontFamily: "'DM Sans', sans-serif" }}>{user?.name}</p>
                    <p style={{ fontSize: "11px", color: C.mid, fontFamily: "'DM Sans', sans-serif" }}>View Profile</p>
                  </div>
                </Link>
              ) : (
                <div style={{ display: "flex", gap: "12px" }}>
                  <Link to="/login" onClick={() => setSidebarOpen(false)}
                    style={{
                      flex: 1, textAlign: "center", padding: "9px",
                      backgroundColor: C.teal, color: "#fff",
                      borderRadius: "8px", fontWeight: 700,
                      fontSize: "12px", letterSpacing: "0.08em",
                      fontFamily: "'DM Sans', sans-serif",
                      textDecoration: "none",
                    }}>Login</Link>
                  <Link to="/sign-up" onClick={() => setSidebarOpen(false)}
                    style={{
                      flex: 1, textAlign: "center", padding: "9px",
                      border: `2px solid ${C.mid}`, color: C.teal,
                      borderRadius: "8px", fontWeight: 700,
                      fontSize: "12px", letterSpacing: "0.08em",
                      fontFamily: "'DM Sans', sans-serif",
                      textDecoration: "none",
                    }}>Sign Up</Link>
                </div>
              )}
            </div>

            {/* Mobile search */}
            <div style={{ padding: "14px 16px", borderBottom: `1px solid rgba(130,192,204,0.2)`, position: "relative" }}>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={mobileSearchTerm}
                  onChange={e => handleSearch(e.target.value, true)}
                  style={{
                    width: "100%", height: "40px",
                    border: `1.5px solid ${C.mid}`,
                    borderRadius: "10px",
                    padding: "0 40px 0 14px",
                    fontSize: "13px",
                    fontFamily: "'DM Sans', sans-serif",
                    color: C.dark,
                    backgroundColor: "#fff",
                  }}
                  className="cm-search-input"
                />
                <AiOutlineSearch size={16} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: C.mid }} />
              </div>
              {mobileSearchData && mobileSearchData.length > 0 && (
                <div style={{
                  position: "absolute", left: "16px", right: "16px", top: "62px",
                  backgroundColor: "#fff", borderRadius: "10px",
                  border: `1px solid rgba(130,192,204,0.3)`,
                  boxShadow: "0 6px 20px rgba(22,105,122,0.1)",
                  zIndex: 10, maxHeight: "240px", overflowY: "auto",
                }}>
                  {mobileSearchData.map((item, i) => (
                    <Link key={i} to={`/product/${item._id}`}
                      onClick={() => { setSidebarOpen(false); setMobileSearchTerm(""); setMobileSearchData(null); }}
                    >
                      <div style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "9px 12px",
                        borderBottom: i < mobileSearchData.length - 1 ? "1px solid rgba(130,192,204,0.1)" : "none",
                      }}>
                        <img src={item.images?.[0]?.url} alt={item.name}
                          style={{ width: "34px", height: "34px", borderRadius: "6px", objectFit: "cover" }} />
                        <span style={{ fontSize: "12px", color: "#374151", fontFamily: "'DM Sans', sans-serif" }}>{item.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* Nav links */}
            <div style={{ padding: "8px 0", borderBottom: `1px solid rgba(130,192,204,0.2)` }}>
              <Navbar active={activeHeading} />
            </div>

            {/* Wishlist */}
            <button
              onClick={() => { setOpenWishList(true); setSidebarOpen(false); }}
              className="cm-sidebar-link"
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "12px",
                padding: "13px 20px",
                background: "none", border: "none", cursor: "pointer",
                borderBottom: `1px solid rgba(130,192,204,0.2)`,
                transition: "background 0.15s",
              }}
            >
              <div style={{ position: "relative" }}>
                <AiOutlineHeart size={22} style={{ color: C.teal }} />
                {wishlist?.length > 0 && (
                  <span style={{
                    position: "absolute", top: "-3px", right: "-5px",
                    backgroundColor: C.orange, color: "#fff",
                    fontSize: "9px", fontWeight: 700,
                    minWidth: "14px", height: "14px",
                    borderRadius: "8px", display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}>{wishlist.length}</span>
                )}
              </div>
              <span style={{ fontSize: "13px", fontWeight: 600, color: C.teal, fontFamily: "'DM Sans', sans-serif" }}>Wishlist</span>
            </button>

            {/* Become Vendor */}
            <div style={{ padding: "16px" }}>
              <Link
                to={isSeller ? "/dashboard" : "/shop-create"}
                onClick={() => setSidebarOpen(false)}
              >
                <div
                  className="cm-vendor-btn"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    backgroundColor: C.orange, color: "#fff",
                    padding: "12px 20px", borderRadius: "10px",
                    fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "background 0.2s",
                    textDecoration: "none",
                  }}
                >
                  {isSeller ? "Go to Dashboard" : "Become a Vendor"}
                  <IoIosArrowForward size={14} />
                </div>
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