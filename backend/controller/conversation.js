const express = require("express");
const router = express.Router();
const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller } = require("../middleware/auth");
const conversation = require("../model/conversation");
//create a new convrsation
router.post(
  "/create-new-converation",
  catchAsyncError(async (req, res, next) => {
    try {
      const { groupTitle, userId, sellerId } = req.body;
      const isConversationExists = await Conversation.findOne({ groupTitle });
      if (isConversationExists) {
        const conversation = isConversationExists;
        res.status(201).json({
          success: true,
          conversation,
        });
      } else {
        const conversation = await Conversation.create({
          members: [userId, sellerId],
          groupTitle: groupTitle,
        });
        res.status(201).json({
          success: true,
          conversation,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//get all converstions selller
router.get(
  `/get-all-conversation-seller/:id`,
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        members: { $in: [req.params.id] },
      }).sort({ updatedAt: -1, createdAt: -1 });

      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//get user conversations
router.get(
  `/get-all-conversation-user/:id`,
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        members: { $in: [req.params.id] },
      }).sort({ updatedAt: -1, createdAt: -1 });

      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// Update The Last Conversation
router.put(
  "/update-last-message/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const { lastMessage, lastMessageId } = req.body;

      const conversation = await Conversation.findByIdAndUpdate(
        req.params.id,
        {
          lastMessage,
          lastMessageId,
        },
        {
          new: true,          // 👈 IMPORTANT
          runValidators: true
        }
      );

      if (!conversation) {
        return next(new ErrorHandler("Conversation not found", 404));
      }

      res.status(200).json({
        success: true,
        conversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


module.exports = router;