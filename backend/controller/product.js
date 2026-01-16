const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const {upload} = require('../multer');
const Shop = require('../model/shop');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const path = require('path');
const fs = require('fs');
const { isSeller } = require("../middleware/auth");



// Create a new product
router.post('/create-product', upload.array('images'), catchAsyncErrors(async (req, res, next) => { 
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);
    
    console.log('Shop found:', shop);
    
    if (!shop) {
        return next(new ErrorHandler("Shop Id is Invalid", 400));
    }

    const files = req.files;
    
    if (!files || files.length === 0) {
        return next(new ErrorHandler("Please upload at least one image", 400));
    }
    
    const imageUrls = files.map((file) => `${file.filename}`);  
    
    console.log('Image URLs:', imageUrls);
    
    const productData = req.body;
    productData.images = imageUrls;
    productData.shopId = shopId; 
    productData.shop = shop;

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
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // Delete associated image files
    product.images.forEach((filename) => {
        const filePath = path.join("uploads", filename);
        fs.unlink(filePath, (err) => {
          if (err) console.log("Error deleting file:", err);
        }); 
    });

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

module.exports = router;