const express = require("express");
const router = express.Router();
const Messages = require("../model/messages");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const cloudinary = require("../config/cloudinary");

// Create new message
router.post(
  "/create-new-message",
  catchAsyncError(async (req, res, next) => {
    try {
   
   
      const { sender, text, conversationId, images } = req.body;
      let imageData;

      if (images) {
        const uploadedImage = await cloudinary.uploader.upload(images, {
          folder: "messages",
          resource_type: "auto",
        });
        
        imageData = {
          public_id: uploadedImage.public_id,
          url: uploadedImage.secure_url,
        };
      }

      const message = new Messages({
        conversationId,
        text: text || undefined,
        sender,
        images: imageData || undefined,
      });

      await message.save();

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get all messages with conversation ID
router.get(
  "/get-all-messages/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const messages = await Messages.find({
        conversationId: req.params.id,
      });

      res.status(201).json({
        success: true,
        messages,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;