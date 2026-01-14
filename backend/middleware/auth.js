const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("./catchAsyncErrors.js");
const jwt = require("jsonwebtoken");
const User = require("../model/user.js");
const Shop = require("../model/shop.js");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { user_token } = req.cookies;

  if (!user_token) {
    return next(new ErrorHandler("please login to continue", 401));
  }

  const decoded = jwt.verify(user_token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);

  next();
});

exports.isSeller = catchAsyncErrors(async (req, res, next) => {
  const { seller_token } = req.cookies;

  if (!seller_token) {
    return next(new ErrorHandler("please login to continue", 401));
  }

  const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
  req.seller = await Shop.findById(decoded.id);

  next();
});
