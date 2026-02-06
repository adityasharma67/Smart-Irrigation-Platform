const express = require("express");
const router = express.Router();
const { isMongoConnected } = require("../db/index.js");
const User = require("../models/User");
const { inMemoryUsers } = require("../storage/inMemory");

router.get("/", async (req, res) => {
  try {
    if (isMongoConnected()) {
      const users = await User.find().select("-password");
      res.json(users);
    } else {
      const users = inMemoryUsers.map(({ password, ...user }) => user);
      res.json(users);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

module.exports = router;
