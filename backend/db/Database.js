

const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((data) => {
      console.log(` MongoDB connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.error(" MongoDB connection error:", err.message);
      if (err.name === "MongooseServerSelectionError") {
        console.error(
          "PRO TIP: This error often means your current IP address is not whitelisted in MongoDB Atlas."
        );
        console.error(
          "Please go to Network Access in your MongoDB Atlas dashboard and add your current IP."
        );
      }
      process.exit(1); 
    });
};

module.exports = connectDatabase;
