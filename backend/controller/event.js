const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const {upload} = require("../multer");
const Event = require("../model/event");
const ErrorHandler = require("../utils/errorHandler");
const Shop = require("../model/shop");
const path = require("path");
const fs = require("fs"); 

// Create a new event
router.post(
  "/create-event",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return next(new ErrorHandler("Shop Id is Invalid", 400));
    }

    if (!req.files || req.files.length === 0) {
      return next(new ErrorHandler("Please upload at least one image", 400));
    }

    const imageUrls = req.files.map((file) => file.filename);

    const eventData = {
      ...req.body,
      images: imageUrls,
      shop,
    };

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  })
);

// Get all events of a shop
router.get('/get-all-events/:id', catchAsyncErrors(async (req, res, next) => {
    console.log('Getting events for shop:', req.params.id);

    // Try finding by both shopId and shop._id to handle different schema structures
    const events = await Event.find({ 
        $or: [
            { shopId: req.params.id },
            { 'shop._id': req.params.id }
        ]
    });

    console.log('Found events:', events.length);

    res.status(200).json({
        success: true,
        events,
    });
}));

// Delete event
router.delete('/delete-shop-event/:id', catchAsyncErrors(async (req, res, next) => {
  const eventId = req.params.id;
  const event = await Event.findById(eventId);

  if (!event) {
    return next(new ErrorHandler("Event not found", 404));
  }

  // Delete associated image files synchronously
  event.images.forEach((filename) => {  
    const filePath = path.join(__dirname, "../uploads", filename);
    
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filename}`);
      }
    } catch (err) {
      console.log(`Error deleting file ${filename}:`, err.message);
    }
  });
  
  // Delete event from database
  await Event.findByIdAndDelete(eventId);

  res.status(200).json({
    success: true,
    message: "Event and associated images deleted successfully",
  });
}));

module.exports = router;