const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Shop = require("../model/shop");
const isSeller = require("../middleware/isSeller");
const CouponCode = require("../model/couponsCode");

// Create a new coupon code
router.post(
  "/create-coupun-code",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const isCoupounCodeExist = await CouponCode.find({
        name: req.body.name,
      });
      if (isCoupounCodeExist.length !== 0) {
        return next(new ErrorHandler("Coupoun code already exists", 400));
      }
      const coupounCode = await CouponCode.create(req.body);
      res.status(201).json({
        success: true,
        coupounCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

    



