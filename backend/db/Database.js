const mongoose = require("mongoose");

const connectDatabase = () => {
  if (!process.env.DB_URL) {
    console.error("ERROR: DB_URL is not defined!");
    return;
  }

  // Prevent multiple connections
  if (mongoose.connections[0].readyState) {
    console.log("Already connected to MongoDB");
    return;
  }

  mongoose
    .connect(process.env.DB_URL)
    .then((data) => {
      console.log(`MongoDB connected: ${data.connection.host}`);
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      // ❌ removed process.exit(1) — it kills Vercel functions!
    });
};

module.exports = connectDatabase;