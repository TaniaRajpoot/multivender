const express = require("express");
const ErrorHandler = require("../utils/ErrorHandler");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated,isAdmin } = require("../middleware/auth");
const cloudinary = require("../config/cloudinary");

// ---------------- CREATE USER ----------------
router.post("/create-user", async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;
    console.log(req.body);
    
    if (!name || !email || !password) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    if (!avatar) {
      return next(new ErrorHandler("Please upload an avatar", 400));
    }

    // Upload avatar to Cloudinary
    const uploadedAvatar = await cloudinary.uploader.upload(avatar, {
      folder: "avatars",
      resource_type: "auto",
    });

    const avatarData = {
      public_id: uploadedAvatar.public_id,
      url: uploadedAvatar.secure_url,
    };

    const tempUser = {
      name,
      email,
      password,
      avatar: avatarData,
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
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      console.log(user);

      if (!user) {
        return next(new ErrorHandler("User doesn't Exist! ", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// logout user
router.get(
  "/logout",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
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

//update User Info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, email, password, phoneNumber } = req.body;
      const user = await User.findById(req.user.id).select("+password");
      
      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      // Verify the current password
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct password!", 400)
        );
      }

      // Check if email is being changed and if new email already exists
      if (email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return next(new ErrorHandler("Email already in use", 400));
        }
      }

      // Update user information
      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;
      
      await user.save();
      
      // ✅ CRITICAL FIX: Fetch user again WITHOUT password
      const updatedUser = await User.findById(req.user.id);
      
      res.status(200).json({
        success: true,
        user: updatedUser, // Now password is excluded
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//update user Avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let existsUser = await User.findById(req.user.id);
      if (req.body.avatar !== "") {
        const imageId = existsUser.avatar.public_id;

        await cloudinary.uploader.destroy(imageId);

        const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
        });
        existsUser.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      await existsUser.save();

      res.status(200).json({
        success: true,
        existsUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//update User Addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      const sameTypeAdress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAdress) {
        return next(
          new ErrorHandler(
            `${req.body.addressType} address is already exists`,
            400
          )
        );
      }
      const existAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );
      if (existAddress) {
        Object.assign(existAddress, req.body);
      } else {
        user.addresses.push(req.body);
      }
      await user.save();
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//delete user address
router.delete(
  `/delete-user-address/:id`,
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;
      //“Find a user by their ID , then (pull/remove) one address from their list of addresses.
      await User.updateOne(
        { _id: userId },
        { $pull: { addresses: { _id: addressId } } }
      );
      const user = await User.findById(userId);
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//update password
router.put(`/update-user-password`, isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    const comparePassword = await user.comparePassword(req.body.oldPassword);
    if (!comparePassword) {
      return next(new ErrorHandler("Wrong Password", 400));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password dosn't match ", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password Updated Successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//find user infromation with the userId
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//get all Users ----> (Admin)
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find().sort({
        createdAt: -1,
      });
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//DeleteUser ---admin
router.delete(
  "/admin-delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return next(
          new ErrorHandler(`User is not available with this ${req.params.id}!`, 400)
        );
      }
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message: "User Deleted Successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


module.exports = router;