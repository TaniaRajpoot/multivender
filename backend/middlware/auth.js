const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("./catchAsyncError");
const jwt = require("jsonwebtoken")
const User = require("../model/user.js")



exports.isAuthenticated = catchAsyncErrors(async(req,res,next)=>{

    const token = req.cookies;

    if (!token) {
        return next (new ErrorHandler("please login to continure",401));
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);

    next();

});
