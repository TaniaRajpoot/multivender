if (process.env.NODE_ENV != "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

const app = require("./app");
const connectDatabase = require("./db/Database");

// Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Shutting down the server for handling uncaught exception`);
});

// Connect DB
connectDatabase();

// ✅ Only listen locally, not on Vercel
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

// ✅ This is what Vercel needs
module.exports = app;