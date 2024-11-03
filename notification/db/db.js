const mongoose = require("mongoose");
const { DB_URL } = require("../config/config");

module.exports = async () => {
  console.log("Connecting to database:", DB_URL);

  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};
