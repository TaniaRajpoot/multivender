const express = require("express");
const path = require("path");
const router = express.Router();
const Shop = require("../model/shop");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isSeller } = require("../middlware/auth");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middlware/catchAsyncError");
const sendShopToken = require("../utils/shopToken");
const user = require("../model/user");

// ---------------- CREATE SHOP ----------------
router.post("/create-shop", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password, address, phoneNumber, zipCode } = req.body;

    console.log("Received shop registration:", { name, email, address, phoneNumber, zipCode });

    // Check if all fields are provided
    if (!name || !email || !password || !address || !phoneNumber || !zipCode) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    // Check if shop already exists
    const sellerEmail = await Shop.findOne({ email });
    if (sellerEmail) {
      if (req.file) {
        const filename = req.file.filename;
        const filePath = `uploads/${filename}`;
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("Error deleting file:", err);
          }
        });
      }
      return next(new ErrorHandler("Shop with this email already exists", 400));
    }

    // Check if file was uploaded
    if (!req.file) {
      return next(new ErrorHandler("Please upload a shop avatar", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const seller = {
      name,
      email,
      password,
      avatar: fileUrl,
      address,
      phoneNumber,
      zipCode,
    };

    // Create activation token (30 minutes for testing, reduce to 10m in production)
    const activationToken = jwt.sign(seller, process.env.ACTIVATION_SECRET, {
      expiresIn: "30m",
    });

    const activationUrl = `http://localhost:5173/seller/activation/${activationToken}`;

    console.log("Activation token created (first 30 chars):", activationToken.substring(0, 30));
    console.log("Activation URL:", activationUrl);

    try {
      // Send activation email
      await sendMail({
        email: email,
        subject: "Activate your Shop",
        message: `Hello ${name}, please click on the link to activate your shop: ${activationUrl}`,
      });

      console.log("Activation email sent to:", email);

      res.status(201).json({
        success: true,
        message: `Please check your email: ${email} to activate your shop`,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    console.error("Error creating shop:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});

// ---------------- ACTIVATE SHOP ----------------
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activationToken } = req.body;

      console.log("=== ACTIVATION REQUEST RECEIVED ===");
      console.log("Token received (first 30 chars):", activationToken ? activationToken.substring(0, 30) + "..." : "NO TOKEN");

      if (!activationToken) {
        console.log(" No activation token provided");
        return next(new ErrorHandler("Activation token is required", 400));
      }

      // Decode token with proper error handling
      let newSeller;
      try {
        console.log("Attempting to verify token...");
        console.log("ACTIVATION_SECRET exists:", !!process.env.ACTIVATION_SECRET);
        
        newSeller = jwt.verify(
          activationToken,
          process.env.ACTIVATION_SECRET
        );
        
        console.log(" Token verified successfully");
        console.log("Decoded seller data:", {
          name: newSeller.name,
          email: newSeller.email,
          hasPassword: !!newSeller.password,
          hasAvatar: !!newSeller.avatar,
          address: newSeller.address,
          phoneNumber: newSeller.phoneNumber,
          zipCode: newSeller.zipCode
        });
      } catch (error) {
        console.log(" Token verification failed");
        console.log("Error name:", error.name);
        console.log("Error message:", error.message);
        
        if (error.name === 'TokenExpiredError') {
          console.log("Token expired at:", error.expiredAt);
          return next(new ErrorHandler("Activation link has expired. Please register again.", 400));
        }
        if (error.name === 'JsonWebTokenError') {
          console.log("Invalid JWT");
          return next(new ErrorHandler("Invalid activation token", 400));
        }
        return next(new ErrorHandler(`Token verification failed: ${error.message}`, 400));
      }

      if (!newSeller) {
        console.log(" Token decoded but no seller data");
        return next(new ErrorHandler("Invalid token", 400));
      }

      const { name, email, password, avatar, zipCode, phoneNumber, address } = newSeller;

      console.log("Checking if shop exists with email:", email);

      // Check if shop already exists
      let existingSeller = await Shop.findOne({ email });
      if (existingSeller) {
        console.log(" Shop already exists:", email);
        return next(new ErrorHandler("Shop already exists", 400));
      }

      console.log("Creating new shop in database...");

      // Create the shop
      const createdShop = await Shop.create({
        name,
        email,
        avatar,
        password,
        zipCode,
        phoneNumber,
        address,
      });

      console.log(" Shop created successfully!");
      console.log("Shop ID:", createdShop._id);
      console.log("Shop email:", createdShop.email);

      sendShopToken(createdShop, 201, res);
    } catch (error) {
      console.error(" Activation error:", error);
      console.error("Error stack:", error.stack);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// ---------------- LOGIN SHOP ----------------
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide all the fields!", 400));
      }

      const shop = await Shop.findOne({ email }).select("+password");
      if (!shop) {
        return next(new ErrorHandler("Shop doesn't exist!", 400));
      }

      const isPasswordValid = await shop.comparePassword(password);

      if (!isPasswordValid) {
        return next(new ErrorHandler("Please provide correct information", 400));
      }

      sendShopToken(shop, 201, res); // ✅ Fixed
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// ---------------- LOAD SHOP ----------------
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
     
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Shop doesn't exist!", 400));
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// ---------------- LOGOUT SHOP ----------------
router.get(
  "/logout",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("seller_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;