const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isMongoConnected } = require("../db/index.js");
const User = require("../models/User");
const { inMemoryUsers } = require("../storage/inMemory");
require("dotenv").config();

// We use a secret key to sign our security tokens (JWT)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// This endpoint handles new people signing up for the platform
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, location, cropType } = req.body;

    // We need at least a name, email, and password to create an account
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (isMongoConnected()) {
      // If our database is online, we check for duplicates and save the new user securely
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "An account with this email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, role: role || "farmer", location, cropType });
      await user.save();

      // We give the new user a token so they're logged in immediately upon registration
      const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ message: "Registration successful", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } else {
      // If the database is down, we use a temporary list to let them test the platform
      if (inMemoryUsers.find(u => u.email === email)) return res.status(400).json({ message: "Account already exists in our temporary storage" });
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { id: Date.now().toString(), name, email, password: hashedPassword, role: role || "farmer", location, cropType };
      inMemoryUsers.push(newUser);
      
      const token = jwt.sign({ userId: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ message: "Registration successful (Temporary)", token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Something went wrong during registration", error: error.message });
  }
});

// This endpoint handles existing users coming back to the platform
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Both email and password are required to log in" });

    if (isMongoConnected()) {
      // We look for the user's account in our database
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: "We couldn't find an account with that email" });

      // We verify their password against the encrypted version we have
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) return res.status(401).json({ message: "The password you entered is incorrect" });

      // We issue a fresh security token for their new session
      const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ message: "Welcome back!", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } else {
      // If the database is offline, we check our temporary visit list
      const user = inMemoryUsers.find(u => u.email === email);
      if (!user) return res.status(401).json({ message: "No temporary account found with that email" });
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) return res.status(401).json({ message: "Incorrect temporary password" });
      
      const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ message: "Welcome back (Temporary)!", token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong while logging you in", error: error.message });
  }
});

module.exports = router;
