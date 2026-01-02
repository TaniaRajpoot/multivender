const mongoose = require("mongoose");

const couponCodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your CopunCode  Name!"],
    unique: true,
  },
  value: {
    type: Number,
    required: [true, "Please Enter Your CopunCode Value!"],
  },
  minAmmount: {
    type: Number,
  },
  maxAmmount: {
    type: Number,
  },
  shop: {
    type: Object,
    required: true,
  },
  selectedProduct: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const CouponCode = mongoose.model("CouponCode", couponCodeSchema);

module.exports = CouponCode;