if (process.env.NODE_ENV != "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

const app = require("./app");
const connectDatabase = require("./db/Database");

// ✅ Debug logs
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DB_URL exists:", !!process.env.DB_URL);
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET_KEY);
console.log("CLOUDINARY exists:", !!process.env.CLOUDINARY_CLOUD_NAME);

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err.message);
  console.error(err.stack);
});

connectDatabase();

if (process.env.NODE_ENV !== "PRODUCTION") {
  const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });

  process.on("unhandledRejection", (err) => {
    console.log(`Shutting down the server for ${err.message}`);
    server.close(() => {
      process.exit(1);
    });
  });
}

module.exports = app;