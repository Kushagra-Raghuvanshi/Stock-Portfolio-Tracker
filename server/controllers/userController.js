const User = require('../models/User');       // Import User model
const bcrypt = require('bcryptjs');           // For hashing and checking passwords
const jwt = require('jsonwebtoken');          // For creating JWT tokens

// REGISTER a new user
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;  // Get data from request body

  try {
    const userExists = await User.findOne({ email });   // Check if email is already used
    if (userExists)
      return res.status(400).json({ message: "User already exists" });  // Send error if so

    const hashedPwd = await bcrypt.hash(password, 10);  // Hash the password with salt rounds = 10

    const user = await User.create({ username, email, password: hashedPwd }); // Save new user

    res.status(201).json({ message: "User created" });  // Send success response
  } catch (err) {
    res.status(500).json({ error: err.message });       // Handle server error
  }
};

// LOGIN an existing user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;  // Get credentials from request

  try {
    const user = await User.findOne({ email });         // Find user by email
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });  // If not found

    const isMatch = await bcrypt.compare(password, user.password);  // Compare passwords
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(                             // Create a JWT token
      { id: user._id },                                 // Payload: user ID
      process.env.JWT_SECRET,                           // Secret key
      { expiresIn: '7d' }                               // Token validity
    );

    res.json({ token, username: user.username });       // Send token and username
  } catch (err) {
    res.status(500).json({ error: err.message });       // Handle error
  }
};
