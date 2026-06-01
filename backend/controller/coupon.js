// routes/coupon.js
const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const CouponCode = require("../model/couponsCode");
const { isSeller } = require("../middleware/auth");

// Create a new coupon code
router.post(
  "/create-coupon-code",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const { name, value, minAmount, maxAmount, selectedProduct } = req.body;

      // Check if coupon already exists for this shop
      const existingCoupon = await CouponCode.find({
        name: name.trim(),
        $or: [{ shop: req.seller._id }, { shopId: String(req.seller._id) }],
      });

      if (existingCoupon.length !== 0) {
        return next(new ErrorHandler("Coupon code already exists", 400));
      }

      // Create coupon with seller's shop id
      const couponCode = await CouponCode.create({
        name: name.trim(),
        value,
        minAmmount: minAmount || null,
        maxAmmount: maxAmount || null,
        selectedProduct: selectedProduct || null,
        shop: req.seller._id,
        shopId: String(req.seller._id),
      });

      res.status(201).json({
        success: true,
        coupon: couponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Get all coupons for the logged-in seller
router.get(
  "/get-coupon/:shopId",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const couponCodes = await CouponCode.find({
        $or: [{ shop: req.params.shopId }, { shopId: req.params.shopId }],
      });
      res.status(200).json({
        success: true,
        couponCodes,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Delete a coupon by ID
router.delete(
  "/delete-coupon/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const couponCode = await CouponCode.findByIdAndDelete(req.params.id);

      if (!couponCode) {
        return next(new ErrorHandler("Coupon code doesn't exist!", 400));
      }

      res.status(200).json({
        success: true,
        message: "Coupon code deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Get a coupon value by name
router.get(
  "/get-coupon-value/:name",
  catchAsyncError(async (req, res, next) => {
    try {
      const couponCode = await CouponCode.findOne({
        name: { $regex: new RegExp(`^${req.params.name.trim()}$`, "i") },
      });

      if (!couponCode) {
        return next(new ErrorHandler("Coupon code not found", 404));
      }

      const coupon = couponCode.toObject();
      coupon.shopId = coupon.shopId || String(coupon.shop?._id || coupon.shop || "");

      res.status(200).json({
        success: true,
        couponCode: coupon,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

module.exports = router;
