const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const Shop = require('../model/shop');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const cloudinary = require('../config/cloudinary');
const { isSeller ,isAuthenticated,isAdmin} = require("../middleware/auth");
const Order = require('../model/order');

// Create a new product
router.post('/create-product', catchAsyncErrors(async (req, res, next) => { 
    const { shopId, images } = req.body;
    const shop = await Shop.findById(shopId);
    
    console.log('Shop found:', shop);
    
    if (!shop) {
        return next(new ErrorHandler("Shop Id is Invalid", 400));
    }

    if (!images || images.length === 0) {
        return next(new ErrorHandler("Please upload at least one image", 400));
    }

    // Upload images to Cloudinary
    const uploadPromises = images.map((image) =>
        cloudinary.uploader.upload(image, {
            folder: "products",
            resource_type: "auto",
        })
    );

    const uploadedImages = await Promise.all(uploadPromises);

    const imageData = uploadedImages.map((result) => ({
        public_id: result.public_id,
        url: result.secure_url,
    }));

    console.log('Uploaded images to Cloudinary:', imageData);

    const productData = {
        ...req.body,
        images: imageData,
        shopId: shopId,
        shop: shop,
    };

    console.log('Product Data before save:', productData);

    const product = await Product.create(productData);
    
    console.log('Product created:', product);
    
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product
    });
}));

// Get all products of a shop
router.get('/get-all-products-shop/:id', catchAsyncErrors(async (req, res, next) => {
    console.log('Getting products for shop:', req.params.id);
    
    const products = await Product.find({ shopId: req.params.id });
    
    console.log('Found products:', products.length);
    
    res.status(200).json({
        success: true,
        products,
    });
}));

// Delete product
router.delete('/delete-shop-product/:id', catchAsyncErrors(async (req, res, next) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
        const deletePromises = product.images.map((image) => {
            // Check if it's the new format (object with public_id)
            if (image.public_id) {
                return cloudinary.uploader.destroy(image.public_id);
            }
            // Skip if it's old format (just a string filename)
            return Promise.resolve();
        });

        await Promise.all(deletePromises);
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
}));

// Get all products (for homepage, search, etc.)
router.get('/get-all-products', catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find().sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        products,
    });
}));

//review for a Product
router.put(
  "/create-new-review",
  isAuthenticated, // ✅ Fixed typo from isAthuenticated
  catchAsyncErrors(async (req, res, next) => { // ✅ Fixed typo from catchAsyncError
    try {
      const { user, rating, comment, productId, orderId } = req.body;
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      // Check if user already reviewed this product
      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id.toString()
      );

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      if (isReviewed) {
        // Update existing review
        product.reviews.forEach((rev) => {
          if (rev.user._id.toString() === req.user._id.toString()) {
            rev.rating = rating;
            rev.comment = comment;
            rev.user = user;
          }
        });
      } else {
        // Add new review
        product.reviews.push(review);
      }

      // Calculate average rating
      let avg = 0;
      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });
      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      // Update order to mark product as reviewed
      await Order.findByIdAndUpdate(
        orderId,
        {
          $set: { "cart.$[elem].isReviewed": true },
        },
        {
          arrayFilters: [{ "elem._id": productId }],
          new: true,
        }
      );

      res.status(200).json({
        success: true,
        message: "Reviewed Successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

//get all products ---- (Admin)
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;