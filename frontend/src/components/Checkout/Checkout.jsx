import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import CheckoutSteps from "./CheckoutSteps";
import { ui } from "../../styles/theme";

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

  const normalizeId = (id) => {
    if (id == null) return "";
    if (typeof id === "object") return String(id._id || id.$oid || id);
    return String(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = couponCode?.trim();
    if (!code) {
      toast.error("Please enter a coupon code");
      return;
    }
    try {
      const res = await axios.get(`${server}/coupon/get-coupon-value/${encodeURIComponent(code)}`);
      const coupon = res.data.couponCode;
      if (!coupon) {
        toast.error("Coupon code doesn't exist!");
        return;
      }

      const shopId = normalizeId(coupon.shopId || coupon.shop);
      const couponCodeValue = coupon.value;
      const selectedProduct = coupon.selectedProduct;

      let eligibleItems =
        cart?.filter((item) => normalizeId(item.shopId) === shopId) || [];

      if (selectedProduct) {
        eligibleItems = eligibleItems.filter((item) => item.name === selectedProduct);
      }

      if (eligibleItems.length === 0) {
        toast.error(
          selectedProduct
            ? "Coupon is not valid for the selected product in your cart"
            : "Coupon code is not valid for items in your cart"
        );
        return;
      }

      const eligiblePrice = eligibleItems.reduce(
        (acc, item) => acc + item.qty * item.discountPrice,
        0
      );

      const minAmount = coupon.minAmmount ?? coupon.minAmount;
      const maxAmount = coupon.maxAmmount ?? coupon.maxAmount;
      if (minAmount != null && eligiblePrice < minAmount) {
        toast.error(`Minimum order amount of $${minAmount} required for this coupon`);
        return;
      }
      if (maxAmount != null && eligiblePrice > maxAmount) {
        toast.error(`Maximum order amount of $${maxAmount} for this coupon exceeded`);
        return;
      }

      const discountAmount = (eligiblePrice * couponCodeValue) / 100;
      setDiscountPrice(discountAmount);
      setCouponCodeData(coupon);
      toast.success(`Coupon applied! You saved $${discountAmount.toFixed(2)}`);
      setCouponCode("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error applying coupon code");
      setCouponCode("");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
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
    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery address</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={ui.label}>Full name</label>
          <input type="text" value={user?.name} readOnly className={`${ui.input} bg-gray-50`} />
        </div>
        <div>
          <label className={ui.label}>Email</label>
          <input type="email" value={user?.email} readOnly className={`${ui.input} bg-gray-50`} />
        </div>
        <div>
          <label className={ui.label}>Phone</label>
          <input type="text" value={user?.phoneNumber} readOnly className={`${ui.input} bg-gray-50`} />
        </div>
        <div>
          <label className={ui.label}>Zip code</label>
          <input type="number" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="e.g. 10001" className={ui.input} />
        </div>

        <div>
          <label className={ui.label}>Country</label>
          <select className={ui.select} value={country} onChange={(e) => { setCountry(e.target.value); setState(""); setCity(""); }}>
            <option value="">Select Country</option>
            {Country && Country.getAllCountries().map((item) => (
              <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={ui.label}>State / province</label>
          <select className={ui.select} value={state} onChange={(e) => { setState(e.target.value); setCity(""); }}>
            <option value="">Select State</option>
            {State && State.getStatesOfCountry(country).map((item) => (
              <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={ui.label}>City</label>
          <select className={ui.select} value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Select City</option>
            {City && City.getCitiesOfState(country, state).map((item) => (
              <option key={item.name} value={item.name}>{item.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={ui.label}>Street address</label>
          <input type="text" required value={address1} onChange={(e) => setAddress1(e.target.value)} placeholder="Building, street" className={ui.input} />
        </div>
        <div>
          <label className={ui.label}>Apartment, suite (optional)</label>
          <input type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="Apt, floor" className={ui.input} />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          className="text-sm font-medium text-teal-700 hover:underline"
          onClick={() => setUserInfo(!userInfo)}
        >
          {userInfo ? "Hide saved addresses" : "Use a saved address"}
        </button>

        {userInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {user?.addresses?.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setAddress1(item.address1);
                  setAddress2(item.address2);
                  setZipCode(item.zipCode);
                  setCountry(item.country);
                  setState(item.state || "");
                  setCity(item.city);
                }}
                className="p-4 text-left rounded-xl border border-gray-200 hover:border-teal-600 bg-white"
              >
                <p className="font-medium text-gray-900">{item.addressType}</p>
                <p className="text-xs text-gray-500 mt-1 truncate">{item.address1}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CartData = ({ handleSubmit, totalPrice, shipping, subTotalPrice, couponCode, setCouponCode, discountPrice, paymentSubmit }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Order summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Items subtotal</span>
            <span className="font-semibold text-gray-900">${subTotalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping (est.)</span>
            <span className="font-semibold text-gray-900">${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="text-gray-600">Discount</span>
            <span className="font-semibold text-green-600">
              {discountPrice > 0 ? `-$${discountPrice.toFixed(2)}` : "$0.00"}
            </span>
          </div>
          <div className="flex justify-between pt-2 text-base">
            <span className="font-semibold text-gray-900">Total to pay</span>
            <span className="text-xl font-bold text-gray-900">${totalPrice}</span>
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Discount code</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 outline-none"
              placeholder="Enter code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button type="button" onClick={handleSubmit} className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800">
              Apply
            </button>
          </div>
        </div>
      </div>
      <button type="button" onClick={paymentSubmit} className="w-full rounded-lg bg-teal-700 py-4 text-base font-semibold text-white hover:bg-teal-800 shadow-sm">
        Continue to payment →
      </button>
    </div>
  );
};

export default Checkout;
