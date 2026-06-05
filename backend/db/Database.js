const mongoose = require("mongoose");
const connectDatabase = async () => {
  try {
    await mongoose.connect(`${process.env.dbURL}`);
    console.log("Connected!");
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

module.exports = connectDatabase;