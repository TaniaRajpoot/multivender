const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("./catchAsyncErrors.js");
const jwt = require("jsonwebtoken");
const User = require("../model/user.js");
const Shop = require("../model/shop.js");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("please login to continue", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);

  next();
});


exports.isSeller = catchAsyncErrors(async (req, res, next) => {
  const token =
    req.cookies.seller_token ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ErrorHandler("please login to continue", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const seller = await Shop.findById(decoded.id);

  if (!seller) {
    return next(new ErrorHandler("Seller not found", 404));
  }

  req.seller = seller;
  next();
});



exports.isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} can not access this resources!`)
      );
    }
    next();
  };
};