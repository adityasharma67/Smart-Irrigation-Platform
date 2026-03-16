const express = require("express");
const router = express.Router();
const { isMongoConnected } = require("../db/index.js");
const User = require("../models/User");
const { inMemoryUsers } = require("../storage/inMemory");

// This endpoint provides a list of all registered users on the platform
router.get("/", async (req, res) => {
  try {
    if (isMongoConnected()) {
      // We fetch all users but select only public info, hiding their sensitive passwords
      const users = await User.find().select("-password");
      res.json(users);
    } else {
      // Fallback: Show the temporary users list from this session (passwords hidden too)
      const users = inMemoryUsers.map(({ password, ...user }) => user);
      res.json(users);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Something went wrong while fetching the user list", error: error.message });
  }
});

module.exports = router;
