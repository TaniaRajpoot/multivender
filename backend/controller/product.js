const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const Shop = require('../model/shop');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const cloudinary = require('../config/cloudinary');
const { isSeller } = require("../middleware/auth");

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

module.exports = router;