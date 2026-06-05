const mongoose = require("mongoose");
const connectDatabase = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URL}`);
    console.log("Connected!");
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

module.exports = connectDatabase;