const express = require("express");
const router = express.Router();
const Shop = require("../model/shop");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const cloudinary = require("../config/cloudinary");

// ---------------- UTILITY: Send Shop Token ----------------
const sendShopToken = (shop, statusCode, res) => {
  const token = shop.getJwtToken();

  res
    .status(statusCode)
    .cookie("seller_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })
    .json({
      success: true,
      seller: {
        _id: shop._id,
        name: shop.name,
        email: shop.email,
        avatar: shop.avatar,
        address: shop.address,
        phoneNumber: shop.phoneNumber,
        zipCode: shop.zipCode,
        availableBalance: shop.availableBalance || 0,
      },
      token,
    });
};

// ---------------- CREATE SHOP ----------------
router.post(
  "/create-shop",
  catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, address, phoneNumber, zipCode, avatar } = req.body;

    if (!name || !email || !password || !address || !phoneNumber || !zipCode) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    const existingShop = await Shop.findOne({ email });
    if (existingShop) {
      return next(new ErrorHandler("Shop with this email already exists", 400));
    }

    if (!avatar) {
      return next(new ErrorHandler("Please upload a shop avatar", 400));
    }

    // Upload avatar to Cloudinary
    const uploadedAvatar = await cloudinary.uploader.upload(avatar, {
      folder: "shops",
      resource_type: "auto",
    });

    const avatarData = {
      public_id: uploadedAvatar.public_id,
      url: uploadedAvatar.secure_url,
    };

    const seller = {
      name,
      email,
      password,
      avatar: avatarData,
      address,
      phoneNumber,
      zipCode,
    };

    const activationToken = jwt.sign(seller, process.env.ACTIVATION_SECRET, {
      expiresIn: "30m",
    });
    const activationUrl = `http://localhost:5173/seller/activation/${activationToken}`;

    await sendMail({
      email,
      subject: "Activate your Shop",
      message: `Hello ${name}, please activate your shop: ${activationUrl}`,
    });

    res.status(201).json({
      success: true,
      message: `Please check your email: ${email} to activate your shop`,
    });
  })
);

// ---------------- ACTIVATE SHOP ----------------
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    const { activationToken } = req.body;
    if (!activationToken)
      return next(new ErrorHandler("Activation token is required", 400));

    let newSeller;
    try {
      newSeller = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(
          new ErrorHandler("Activation link expired. Please register again.", 400)
        );
      }
      return next(new ErrorHandler("Invalid activation token", 400));
    }

    const { name, email, password, avatar, zipCode, phoneNumber, address } =
      newSeller;

    const existingShop = await Shop.findOne({ email });
    if (existingShop)
      return next(new ErrorHandler("Shop already exists", 400));

    const createdShop = await Shop.create({
      name,
      email,
      password,
      avatar,
      zipCode,
      phoneNumber,
      address,
    });

    sendShopToken(createdShop, 201, res);
  })
);

// ---------------- LOGIN SHOP ----------------
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new ErrorHandler("Please provide all the fields!", 400));

    const shop = await Shop.findOne({ email }).select("+password");
    if (!shop) return next(new ErrorHandler("Shop doesn't exist!", 400));

    const isPasswordValid = await shop.comparePassword(password);
    if (!isPasswordValid)
      return next(new ErrorHandler("Incorrect credentials", 400));

    sendShopToken(shop, 201, res);
  })
);

// ---------------- LOAD SHOP ----------------
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const seller = await Shop.findById(req.seller._id);
    if (!seller) return next(new ErrorHandler("Shop doesn't exist!", 400));

    res.status(200).json({
      success: true,
      seller,
    });
  })
);

router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      if (!shop) {
        return next(new ErrorHandler("Seller doesn't exist!", 400));
      }
      res.status(200).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// LogOut Shop
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("seller_token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(201).json({
        success: true,
        message: "Logout Successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;