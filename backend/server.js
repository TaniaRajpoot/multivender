const app = require("./app");
const connectDatabase = require("./db/Database");
// Load env

//Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`shutting down the server for andling uncaught exception `);
});

//config
if (process.env.NODE_ENV != "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",  // was "backend/.env"
  });
}

//connect db
connectDatabase();

// create server

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

//unhadled promise rejection

process.on("unhandledRejection", (err) => {
  console.log(`shutting down the server for ${err.message}`);
  console.log(`shutting down the server handle uncaught  promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
