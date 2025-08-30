const express = require("express");
const path = require("path");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const router = express.Router();
const catchAsyncErrors = require("../middlware/catchAsyncError");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const fs = require("fs");
const { isAuthenticated } = require("../middlware/auth");

// ---------------- CREATE USER ----------------
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (req.file) {
        const filePath = path.join("uploads", req.file.filename);
        fs.unlink(filePath, (err) => {
          if (err) console.log("Error deleting file:", err);
        });
      }
      return next(new ErrorHandler("User already exists", 400));
    }

    if (!req.file) {
      return next(new ErrorHandler("Please upload an avatar", 400));
    }

    const filename = req.file.filename;

    const tempUser = {
      name,
      email,
      password,
      avatar: {
        public_id: Date.now().toString(),
        url: `/uploads/${filename}`,
      },
    };

    // Create activation token
    const activationToken = jwt.sign(tempUser, process.env.ACTIVATION_SECRET, {
      expiresIn: "5m",
    });

    const activationUrl = `http://localhost:5173/activation/${activationToken}`;

    // Send activation email
    await sendMail({
      email: email,
      subject: "Activate your account",
      message: `Hello ${name}, please click on the link to activate your account: ${activationUrl}`,
    });

    res.status(201).json({
      success: true,
      message: `Please check your email: ${email} to activate your account`,
    });
  } catch (error) {
    next(error);
  }
});

// ---------------- ACTIVATE USER ----------------
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activationToken } = req.body;

      if (!activationToken) {
        return next(new ErrorHandler("Activation token is required", 400));
      }

      // Decode token
      const newUser = jwt.verify(
        activationToken,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }

      const { name, email, password, avatar } = newUser;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }

      const createdUser = await User.create({
        name,
        email,
        avatar,
        password,
      });
      await createdUser.save();

      sendToken(createdUser, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide all the fields! ", 400));
      }

      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("User doesn't Exist! ", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide correct information ", 400)
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


//load user
router.get("/getuser",isAuthenticated,catchAsyncErrors(async(req,res,next)=>{
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
    return next(new ErrorHandler("User doesn't Exist! ", 400));

    }

    res.status(200).json({
      success:true,
      user,
    });


    
  } catch (error) {
  return next(new ErrorHandler(error.message, 500));
  }
}))

module.exports = router;
