const mongoose = require('mongoose');  // Import Mongoose

// Define schema for a User
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },           // Must provide a username
  email:    { type: String, required: true, unique: true }, // Email must be unique
  password: { type: String, required: true },           // Hashed password
}, { timestamps: true });  // Automatically add createdAt and updatedAt timestamps

// Export the model so it can be used in controllers
module.exports = mongoose.model('User', userSchema);
