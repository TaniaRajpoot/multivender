if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

const app = require("./app");
const connectDatabase = require("./db/Database");

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

const startServer = async () => {
  try {
    const data = await connectDatabase();

    console.log(
      `MongoDB connected: ${data.connection.host}`
    );

    const server = app.listen(process.env.PORT, () => {
      console.log(
        `Server running on http://localhost:${process.env.PORT}`
      );
    });

    process.on("unhandledRejection", (err) => {
      console.error("UNHANDLED REJECTION:", err);

      server.close(() => {
        process.exit(1);
      });
    });
  } catch (err) {
    console.error("DATABASE CONNECTION FAILED:", err);
    process.exit(1);
  }
};

startServer();

module.exports = app;