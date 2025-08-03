// Import required modules
const express = require('express');           // Web framework for Node.js
const mongoose = require('mongoose');         // MongoDB ODM (Object Data Modeling)
const cors = require('cors');                 // Allows cross-origin requests
require('dotenv').config();                   // Loads variables from .env file

const app = express();                        // Create Express app

// Middleware
app.use(cors());                              // Enable CORS for all routes so that brwoser doesnt 
                                              // stop frontend from interacting with backend
app.use(express.json());                      // Parse JSON request bodies

// Route imports
app.use('/api/users', require('./routes/userRoutes'));     // Handles register/login routes
app.use('/api/stocks', require('./routes/stockRoutes'));   // Handles dashboard routes

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,                      // Use new URL parser (optional)
  useUnifiedTopology: true                    // Use new server discovery engine
})
.then(() => {
  console.log("Connected to MongoDB");        // Success message
  app.listen(5000, () =>                      // Start Express server on port 5000
    console.log('Server running on http://localhost:5000')
  );
})
.catch(err => console.error('MongoDB connection error:', err)); // Handle connection error
