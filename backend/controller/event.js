const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");
const Shop = require("../model/shop");
const cloudinary = require("../config/cloudinary");

// Create a new event
router.post(
  "/create-event",
  catchAsyncErrors(async (req, res, next) => {
    const { shopId, images } = req.body;
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return next(new ErrorHandler("Shop Id is Invalid", 400));
    }

    if (!images || images.length === 0) {
      return next(new ErrorHandler("Please upload at least one image", 400));
    }

    // Upload images to Cloudinary
    const uploadPromises = images.map((image) =>
      cloudinary.uploader.upload(image, {
        folder: "events",
        resource_type: "auto",
      })
    );

    const uploadedImages = await Promise.all(uploadPromises);

    const imageData = uploadedImages.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));

    const eventData = {
      ...req.body,
      images: imageData,
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
router.get(
  "/get-all-events/:id",
  catchAsyncErrors(async (req, res, next) => {
    console.log("Getting events for shop:", req.params.id);

    // Try finding by both shopId and shop._id to handle different schema structures
    const events = await Event.find({
      $or: [{ shopId: req.params.id }, { "shop._id": req.params.id }],
    });

    console.log("Found events:", events.length);

    res.status(200).json({
      success: true,
      events,
    });
  })
);

// Delete event
router.delete(
  "/delete-shop-event/:id",
  catchAsyncErrors(async (req, res, next) => {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return next(new ErrorHandler("Event not found", 404));
    }

    // Delete images from Cloudinary
    if (event.images && event.images.length > 0) {
        const deletePromises = event.images.map((image) => {
            // Check if it's the new format (object with public_id)
            if (image.public_id) {
                return cloudinary.uploader.destroy(image.public_id);
            }
            // Skip if it's old format (just a string filename)
            return Promise.resolve();
        });

        await Promise.all(deletePromises);
    }

    // Delete event from database
    await Event.findByIdAndDelete(eventId);

    res.status(200).json({
      success: true,
      message: "Event and associated images deleted successfully",
    });
  })
);

// Get all events (for all shops)
router.get(
  "/get-all-events",
  catchAsyncErrors(async (req, res, next) => {
    const events = await Event.find();
    res.status(200).json({
      success: true,
      events,
    });
  })
);

module.exports = router;