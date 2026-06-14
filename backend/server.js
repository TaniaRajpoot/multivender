if (process.env.NODE_ENV != "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

const app = require("./app");
const connectDatabase = require("./db/Database");

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err.message);
  console.error(err.stack);
});

// Connect DB immediately on cold start
connectDatabase();

if (!process.env.VERCEL) {
  const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Server running on port ${process.env.PORT || 8000}`);
  });

  process.on("unhandledRejection", (err) => {
    console.log(`Shutting down: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

module.exports = app;