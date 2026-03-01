const express = require("express");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Order = require("../model/order");
const Product = require("../model/product");
const Shop = require("../model/shop");
const Event = require("../model/event");
const { isAuthenticated, isAdmin, isSeller } = require("../middleware/auth");

//create Order (User)
router.post(
  "/create-order",
  catchAsyncError(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;
      //   group cart items by shopId
      const shopItemsMap = new Map();

      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }

      // create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);
      }
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//Get All Orders (User)
router.get(
  "/get-all-orders/:userId",
  catchAsyncError(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });
      if (!orders) {
        return next(new ErrorHandler("No Order Found", 404));
      }
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//get all orders (Seller)
router.get(
  `/get-seller-all-orders/:shopId`,
  catchAsyncError(async (req, res, next) => {
    try {
      const orders = await Order.find({
        "cart.shopId": req.params.shopId,
      }).sort({
        createdAt: -1,
      });
      if (!orders) {
        return next(new ErrorHandler("No Order Found", 404));
      }
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//Update Order Status (seller)
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order Not Found", 400));
      }

      // Helper function to update product stock and sales
      async function updateOrder(id, qty) {
        // Try updating Product model
        const product = await Product.findById(id);
        if (product) {
          product.stock -= qty;
          product.sold_out += qty;
          await product.save({ validateBeforeSave: false });
        }

        // Also try updating Event model (in case it's an event product)
        const event = await Event.findById(id);
        if (event) {
          event.stock -= qty;
          event.sold_out += qty;
          await event.save({ validateBeforeSave: false });
        }
      }

      // Helper function to update seller balance
      async function updateSellerInfo(amount) {
        const seller = await Shop.findById(req.seller.id);
        if (seller) {
          seller.availableBalance = (seller.availableBalance || 0) + amount;
          await seller.save();
        }
      }

      // Update product stock when transferred to delivery
      if (req.body.status === "Transferred to delivery partner") {
        for (const item of order.cart) {
          await updateOrder(item._id, item.qty);
        }
      }

      // Update seller balance when delivered
      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "succeeded";
        const serviceCharge = order.totalPrice * 0.1;
        const sellerAmount = order.totalPrice - serviceCharge;
        await updateSellerInfo(sellerAmount);
      }

      order.status = req.body.status;
      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// give a refund (user)
router.put(
  "/order-refund/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found", 400));
      }

      order.status = req.body.status;
      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request Successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//accept the refund (Seller)
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found", 400));
      }

      // Helper function to update product stock (restore stock on refund)
      async function updateOrder(id, qty) {
        const product = await Product.findById(id);
        if (product) {
          product.stock += qty; // Add back to stock
          product.sold_out -= qty; // Reduce sold_out count
          await product.save({ validateBeforeSave: false });
        }
      }

      // Helper function to update seller balance (deduct refunded amount)
      async function updateSellerBalance(amount) {
        const seller = await Shop.findById(req.seller.id);
        if (seller) {
          seller.availableBalance = (seller.availableBalance || 0) - amount;
          await seller.save();
        }
      }

      // Update product stock if refund is successful
      if (req.body.status === "Refund Success") {
        for (const item of order.cart) {
          await updateOrder(item._id, item.qty);
        }

        // Deduct the refunded amount from seller's balance
        const serviceCharge = order.totalPrice * 0.1;
        const sellerAmount = order.totalPrice - serviceCharge;
        await updateSellerBalance(sellerAmount);
      }

      order.status = req.body.status;
      await order.save();

      res.status(200).json({
        success: true,
        message: "Order Refund Successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// All Orders for the Admin
router.get(
  "/admin-all-orders",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;