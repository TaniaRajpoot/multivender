const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("./catchAsyncErrors.js");
const jwt = require("jsonwebtoken")
const User = require("../model/user.js");
const shop = require("../model/shop.js");



exports.isAuthenticated = catchAsyncErrors(async(req,res,next)=>{

    const token = req.cookies.token;
   

    if (!token) {
        return next (new ErrorHandler("please login to continure",401));
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
 

    next();

});

exports.isSeller = catchAsyncErrors(async(req,res,next)=>{

    const {seller_token} = req.cookies;
   

    if (!seller_token) {
        return next (new ErrorHandler("please login to continure",401));
    }
    const decoded = jwt.verify(seller_token,process.env.JWT_SECRET_KEY);
    req.seller = await shop.findById(decoded.id);
 

    next();

});
