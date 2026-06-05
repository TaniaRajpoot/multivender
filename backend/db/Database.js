const mongoose = require("mongoose");

let isConnected = false;

const connectDatabase = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  if (!process.env.DB_URL) {
    console.error("ERROR: DB_URL is not defined!");
    return;
  }

  try {
    const connected=await mongoose.connect(${dbURl}, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      maxPoolSize: 10,
    });
    isConnected = true;
    console.log(`MongoDB connected: ${db.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    isConnected = false;
  }
};

module.exports = connectDatabase;