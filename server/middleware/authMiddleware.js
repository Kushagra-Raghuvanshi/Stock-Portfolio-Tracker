const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Check for token in header
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Put decoded user (id) into request object
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = verifyToken;
