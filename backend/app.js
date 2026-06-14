//config - MUST BE FIRST before any middleware that uses env vars
if (process.env.NODE_ENV != "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env", // ✅ fixed path
  });
}

const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

const isDev = process.env.NODE_ENV !== "PRODUCTION";

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (isDev && /^http:\/\/localhost(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
        .split(",")
        .map((url) => url.trim());
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupon");
const conversation = require("./controller/conversation");
const messages = require("./controller/messages");
const order = require("./controller/order");
const payment = require("./controller/payment");
const withdraw = require("./controller/withdraw");

app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/messages", messages);
app.use("/api/v2/order", order);
app.use("/api/v2/payment", payment);
app.use("/api/v2/withdraw", withdraw);

// Error Handler - must be last
app.use(ErrorHandler);

module.exports = app;