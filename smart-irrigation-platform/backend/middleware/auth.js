const jwt = require("jsonwebtoken");
require("dotenv").config();

// This secret key is the "private signature" we use to verify our session tokens
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// This middleware checks if a visitor has a valid "security pass" (token) before letting them access private features
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // If there's no pass, we can't let them through
  if (!token) {
    return res.status(401).json({ message: "Please log in to access this feature" });
  }

  // We check if the pass is authentic and hasn't expired
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Your session has expired or is invalid. Please log in again." });
    }
    // We attach the user's info to the request so the next function knows who is making the call
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
