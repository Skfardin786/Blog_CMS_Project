/**
 * Database Configuration
 * ---------------------
 * This file handles the MongoDB connection using Mongoose.
 * We export a single async function `connectDB` that the server
 * calls at startup. If the connection fails, the process exits
 * so we don't run a server without a database.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise that resolves with the connection object
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit with failure code (1) — this prevents the server from running
    // without a database, which would cause confusing errors later
    process.exit(1);
  }
};

module.exports = connectDB;
