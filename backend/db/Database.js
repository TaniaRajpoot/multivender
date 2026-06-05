const mongoose = require("mongoose");

const connectDatabase = () => {
  console.log("Attempting DB connection...");
  
  if (!process.env.DB_URL) {
    console.error("ERROR: DB_URL is not defined!");
    process.exit(1);
  }

  mongoose
    .connect(process.env.DB_URL)
    .then((data) => {
      console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      console.error("Full error:", err);
      process.exit(1);
    });
};

module.exports = connectDatabase;