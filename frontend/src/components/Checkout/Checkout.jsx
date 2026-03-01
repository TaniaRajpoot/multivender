import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import CheckoutSteps from "./CheckoutSteps";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentSubmit = () => {
    if (address1 === "" || address2 === "" || zipCode === "" || country === "" || state === "" || city === "") {
      toast.error("Please Choose Your Delivery Address!");
    } else {
      const shippingAddress = { address1, address2, zipCode, country, state, city };
      const orderData = { cart, totalPrice, subTotalPrice, shipping, discountPrice, shippingAddress, user };
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const subTotalPrice = cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);
  const shipping = subTotalPrice * 0.1;
  const totalPrice = couponCodeData ? (subTotalPrice + shipping - discountPrice).toFixed(2) : (subTotalPrice + shipping).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;
    try {
      const res = await axios.get(`${server}/coupon/get-coupon-value/${name}`);
      if (res.data.couponCode !== null) {
        let shopId = res.data.couponCode?.shopId || res.data.couponCode?.shop;
        if (shopId && typeof shopId === 'object' && shopId.$oid) shopId = shopId.$oid;
        const couponCodeValue = res.data.couponCode?.value;
        const isCouponValid = cart && cart.filter((item) => {
          const itemShopId = typeof item.shopId === 'object' && item.shopId.$oid ? item.shopId.$oid : item.shopId;
          return itemShopId === shopId;
        });
        if (isCouponValid.length === 0) {
          toast.error("Coupon code is not valid for items in your cart");
        } else {
          const eligiblePrice = isCouponValid.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);
          const discountAmount = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discountAmount);
          setCouponCodeData(res.data.couponCode);
          toast.success(`Coupon applied! You saved ${discountAmount.toFixed(2)}`);
        }
      } else {
        toast.error("Coupon code doesn't exist!");
      }
      setCouponCode("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error applying coupon code");
      setCouponCode("");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#EDE7E3] pb-20">
      <CheckoutSteps active={1} />
      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24">
        <div className="flex flex-col lg:flex-row gap-12 mt-8">
          {/* Left Part - Shipping Info */}
          <div className="w-full lg:w-[65%]">
            <ShippingInfo
              user={user}
              country={country} setCountry={setCountry}
              state={state} setState={setState}
              city={city} setCity={setCity}
              userInfo={userInfo} setUserInfo={setUserInfo}
              address1={address1} setAddress1={setAddress1}
              address2={address2} setAddress2={setAddress2}
              zipCode={zipCode} setZipCode={setZipCode}
            />
          </div>

          {/* Right Part - Summary */}
          <div className="w-full lg:w-[35%]">
            <CartData
              handleSubmit={handleSubmit}
              totalPrice={totalPrice}
              shipping={shipping}
              subTotalPrice={subTotalPrice}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              discountPrice={discountPrice}
              paymentSubmit={paymentSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ShippingInfo = ({ user, country, setCountry, state, setState, city, setCity, userInfo, setUserInfo, address1, setAddress1, address2, setAddress2, zipCode, setZipCode }) => {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 md:p-12 border border-white shadow-soft">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-10 h-10 bg-[#16697A] rounded-xl flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
        <h2 className="text-2xl font-[700] text-[#16697A] tracking-tight font-display italic">Shipping Address</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-[0.2em] ml-1 font-sans">Name on Card</label>
          <input type="text" value={user?.name} readOnly className="w-full bg-[#EDE7E3]/30 border border-transparent rounded-2xl px-6 py-4 font-[500] text-[#16697A] shadow-inner font-sans" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-[0.2em] ml-1">Email Address</label>
          <input type="email" value={user?.email} readOnly className="w-full bg-[#EDE7E3]/30 border border-transparent rounded-2xl px-6 py-4 font-[500] text-[#16697A] shadow-inner font-sans" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#489FB5] uppercase tracking-[0.2em] ml-1">Phone Number</label>
          <input type="text" value={user?.phoneNumber} readOnly className="w-full bg-[#EDE7E3]/30 border border-transparent rounded-2xl px-6 py-4 font-[500] text-[#16697A] shadow-inner font-sans" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#489FB5] uppercase tracking-[0.2em] ml-1">Zip Code</label>
          <input type="number" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="e.g. 10001" className="w-full bg-[#EDE7E3]/50 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-[500] text-[#16697A] shadow-inner transition-all outline-none font-sans" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-[0.2em] ml-1 font-sans">Country</label>
          <select className="w-full bg-[#EDE7E3]/50 border border-transparent rounded-2xl px-6 py-4 font-bold text-[#16697A] shadow-inner outline-none appearance-none" value={country} onChange={(e) => { setCountry(e.target.value); setState(""); setCity(""); }}>
            <option value="">Select Country</option>
            {Country && Country.getAllCountries().map((item) => (
              <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-[0.2em] ml-1 font-sans">State/Province</label>
          <select className="w-full bg-[#EDE7E3]/50 border border-transparent rounded-2xl px-6 py-4 font-bold text-[#16697A] shadow-inner outline-none appearance-none" value={state} onChange={(e) => { setState(e.target.value); setCity(""); }}>
            <option value="">Select State</option>
            {State && State.getStatesOfCountry(country).map((item) => (
              <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-[700] text-[#489FB5] uppercase tracking-[0.2em] ml-1 font-sans">City</label>
          <select className="w-full bg-[#EDE7E3]/50 border border-transparent rounded-2xl px-6 py-4 font-bold text-[#16697A] shadow-inner outline-none appearance-none" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Select City</option>
            {City && City.getCitiesOfState(country, state).map((item) => (
              <option key={item.name} value={item.name}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#489FB5] uppercase tracking-[0.2em] ml-1">Primary Address</label>
          <input type="text" required value={address1} onChange={(e) => setAddress1(e.target.value)} placeholder="Building, Street Name" className="w-full bg-[#EDE7E3]/50 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-[500] text-[#16697A] shadow-inner transition-all outline-none font-sans" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#489FB5] uppercase tracking-[0.2em] ml-1">Secondary Address</label>
          <input type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="Apartment, Studio, Suite" className="w-full bg-[#EDE7E3]/50 border border-transparent focus:border-[#16697A]/20 focus:bg-white rounded-2xl px-6 py-4 font-[500] text-[#16697A] shadow-inner transition-all outline-none font-sans" />
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-[#16697A]/10">
        <h5 className="text-[#489FB5] font-black text-xs uppercase tracking-widest cursor-pointer hover:text-[#FFA62B] transition-colors inline-flex items-center gap-2" onClick={() => setUserInfo(!userInfo)}>
          {userInfo ? "− Hide Saved Addresses" : "+ Use A Saved Address"}
        </h5>

        {userInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 animate-in slide-in-from-top duration-500">
            {user && user.addresses.map((item, index) => (
              <div key={index} onClick={() => { setAddress1(item.address1); setAddress2(item.address2); setZipCode(item.zipCode); setCountry(item.country); setState(item.state || ""); setCity(item.city); }}
                className="p-5 bg-white rounded-2xl border-2 border-transparent hover:border-[#16697A] cursor-pointer group transition-all shadow-sm">
                <h2 className="font-black text-[#16697A] group-hover:text-[#489FB5]">{item.addressType}</h2>
                <p className="text-xs text-[#6B7280] font-bold mt-1 truncate">{item.address1}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CartData = ({ handleSubmit, totalPrice, shipping, subTotalPrice, couponCode, setCouponCode, discountPrice, paymentSubmit }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 md:p-10 border border-white shadow-soft">
        <h3 className="text-xl font-[700] text-[#16697A] mb-8 tracking-tight font-display italic">Order Summary</h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">Subtotal</span>
            <span className="text-lg font-[700] text-[#16697A] font-sans">${subTotalPrice.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">Shipping</span>
            <span className="text-lg font-[700] text-[#16697A] font-sans">${shipping.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-4 border-b border-[#16697A]/10">
            <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">Discount</span>
            <span className="text-lg font-[700] text-green-600 font-sans">
              {discountPrice > 0 ? `-$${discountPrice.toFixed(2)}` : "$0.00"}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[12px] font-[700] text-[#16697A] uppercase tracking-[0.2em] font-sans">Total</span>
            <span className="text-3xl font-[700] text-[#16697A] tracking-tighter font-display italic font-sans">${totalPrice}</span>
          </div>
        </div>

        <div className="mt-10">
          <label className="block text-[10px] font-black text-[#489FB5] uppercase tracking-widest mb-3 ml-1">Promotional Code</label>
          <div className="flex gap-3">
            <input type="text" className="flex-1 bg-[#EDE7E3]/50 border border-transparent rounded-2xl px-5 py-4 font-bold text-sm text-[#16697A] shadow-inner outline-none transition-all focus:bg-white" placeholder="ENTER CODE" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
            <button type="submit" onClick={handleSubmit} className="px-8 bg-[#16697A] text-white font-[700] text-[11px] rounded-2xl hover:bg-[#FFA62B] transition-all shadow-lg uppercase tracking-widest font-sans">Apply</button>
          </div>
        </div>
      </div>

      <button onClick={paymentSubmit} className="group relative w-full h-24 flex items-center justify-center bg-[#16697A] text-[#EDE7E3] font-[700] text-lg rounded-[32px] hover:bg-[#FFA62B] transition-all duration-500 shadow-2xl overflow-hidden transform hover:-translate-y-2 font-sans uppercase tracking-[0.2em] text-[15px]">
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        <span className="relative z-10 flex items-center gap-4">
          Go to Payment
          <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </span>
      </button>

      <div className="flex flex-col items-center gap-4 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#16697A]">Global Payment Partners</p>
        <div className="flex gap-6 items-center grayscale">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-4 object-contain" alt="Visa" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6 object-contain" alt="Mastercard" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" className="h-5 object-contain" alt="Paypal" />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
