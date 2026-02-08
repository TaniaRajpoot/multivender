import React, { useState, useEffect } from "react";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import styles from "../../styles/styles";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
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
    if (
      address1 === "" ||
      address2 === "" ||
      zipCode === "" ||
      country === "" ||
      city === ""
    ) {
      toast.error("Please Choose Your Delivery Address!");
    } else {
      const shippingAddress = {
        address1,
        address2,
        zipCode,
        country,
        city,
      };
      const orderData = {
        cart,
        totalPrice,
        subTotalPrice,
        shipping,
        discountPrice,
        shippingAddress,
        user,
      };
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const shipping = subTotalPrice * 0.1;
  
  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPrice).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;
    
    try {
      const res = await axios.get(`${server}/coupon/get-coupon-value/${name}`);
      
      if (res.data.couponCode !== null) {
        // Extract shop ID - handle both string and MongoDB object format
        let shopId = res.data.couponCode?.shopId || res.data.couponCode?.shop;
        
        // If shop is a MongoDB object with $oid, extract the ID
        if (shopId && typeof shopId === 'object' && shopId.$oid) {
          shopId = shopId.$oid;
        }
        
        const couponCodeValue = res.data.couponCode?.value;
        
        console.log("Coupon shop ID:", shopId);
        console.log("Cart items:", cart.map(item => ({ name: item.name, shopId: item.shopId })));
        
        // Check if ANY item in cart is from the shop that owns this coupon
        const isCouponValid = cart && cart.filter((item) => {
          // Handle both string comparison and MongoDB object comparison
          const itemShopId = typeof item.shopId === 'object' && item.shopId.$oid 
            ? item.shopId.$oid 
            : item.shopId;
          return itemShopId === shopId;
        });

        if (isCouponValid.length === 0) {
          toast.error("Coupon code is not valid for items in your cart");
          setCouponCode("");
        } else {
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.discountPrice,
            0
          );
          const discountAmount = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discountAmount);
          setCouponCodeData(res.data.couponCode);
          setCouponCode("");
          toast.success(`Coupon applied! You saved ${discountAmount.toFixed(2)}`);
        }
      } else {
        toast.error("Coupon code doesn't exist!");
        setCouponCode("");
      }
    } catch (error) {
      console.error("Coupon error:", error);
      toast.error(error.response?.data?.message || "Error applying coupon code");
      setCouponCode("");
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8 bg-gray-50">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex gap-5">
        {/* Left side - Shipping Address */}
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
          />
        </div>
        
        {/* Right side - Order Summary & Discount */}
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPrice={discountPrice}
          />
        </div>
      </div>
      
      <div
        className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`}
        onClick={paymentSubmit}
      >
        <h5 className="text-white">Go to Payment</h5>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
}) => {
  return (
    <div className="w-full bg-white rounded-md p-5 pb-8 shadow-sm">
      <h5 className="text-[18px] font-semibold mb-4">Shipping Address</h5>
      <div>
        <div className="w-full flex gap-3 pb-3">
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={user?.name || ""}
              required
              readOnly
              className={`${styles.input} bg-gray-50`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-medium">Email Address</label>
            <input
              type="email"
              value={user?.email || ""}
              required
              readOnly
              className={`${styles.input} bg-gray-50`}
            />
          </div>
        </div>

        <div className="w-full flex gap-3 pb-3">
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-medium">Phone Number</label>
            <input
              type="number"
              required
              value={user?.phoneNumber || ""}
              readOnly
              className={`${styles.input} bg-gray-50`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-medium">Zip Code</label>
            <input
              type="number"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div className="w-full flex gap-3 pb-3">
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-medium">Country</label>
            <select
              className="w-full border h-10 rounded-md px-2"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Choose your country</option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-medium">City</label>
            <select
              className="w-full border h-10 rounded-md px-2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Choose your City</option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="w-full flex gap-3 pb-3">
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-medium">Address 1</label>
            <input
              type="text"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className={`${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-medium">Address 2</label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>
      </div>
      
      <h5
        className="text-[16px] cursor-pointer inline-block text-blue-600 hover:underline mt-3"
        onClick={() => setUserInfo(!userInfo)}
      >
        Choose From saved address
      </h5>
      
      {userInfo && (
        <div className="mt-3">
          {user &&
            user.addresses.map((item, index) => (
              <div key={index} className="w-full flex items-center mt-2 p-2 border rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  className="mr-3"
                  value={item.addressType}
                  onClick={() => {
                    setAddress1(item.address1);
                    setAddress2(item.address2);
                    setZipCode(item.zipCode);
                    setCountry(item.country);
                    setCity(item.city);
                  }}
                />
                <h2 className="font-medium">{item.addressType}</h2>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPrice,
}) => {
  return (
    <div className="w-full bg-white rounded-md p-5 pb-8 shadow-sm">
      <h3 className="text-[18px] font-semibold mb-4">Order Summary</h3>
      
      <div className="flex justify-between mb-3">
        <h3 className="text-[16px] font-normal text-gray-600">Subtotal:</h3>
        <h5 className="text-[18px] font-semibold">${subTotalPrice.toFixed(2)}</h5>
      </div>
      
      <div className="flex justify-between mb-3">
        <h3 className="text-[16px] font-normal text-gray-600">Shipping:</h3>
        <h5 className="text-[18px] font-semibold">${shipping.toFixed(2)}</h5>
      </div>
      
      <div className="flex justify-between border-b pb-3 mb-3">
        <h3 className="text-[16px] font-normal text-gray-600">Discount:</h3>
        <h5 className="text-[18px] font-semibold text-green-600">
          {discountPrice > 0 ? `-$${discountPrice.toFixed(2)}` : "$0.00"}
        </h5>
      </div>
      
      <div className="flex justify-between mb-4">
        <h3 className="text-[18px] font-semibold">Total:</h3>
        <h5 className="text-[20px] font-bold text-blue-600">${totalPrice}</h5>
      </div>
      
      <div className="border-t pt-4">
        <h4 className="text-[16px] font-semibold mb-3">Have a Coupon Code?</h4>
        <div onSubmit={handleSubmit} component="form">
          <input
            type="text"
            className={`${styles.input} h-10 pl-3 mb-3`}
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full h-10 border-2 border-[#f63b60] bg-white text-[#f63b60] hover:bg-[#f63b60] hover:text-white transition-colors rounded-md cursor-pointer font-semibold"
          >
            Apply Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
