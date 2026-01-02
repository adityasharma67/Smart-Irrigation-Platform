const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isMongoConnected } = require("../db/index.js");
const User = require("../models/User");
const { inMemoryUsers } = require("../storage/inMemory");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, location, cropType } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (isMongoConnected()) {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, role: role || "farmer", location, cropType });
      await user.save();

      const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ message: "Registration successful", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } else {
      if (inMemoryUsers.find(u => u.email === email)) return res.status(400).json({ message: "User already exists" });
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { id: Date.now().toString(), name, email, password: hashedPassword, role: role || "farmer", location, cropType };
      inMemoryUsers.push(newUser);
      const token = jwt.sign({ userId: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ message: "Registration successful", token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    if (isMongoConnected()) {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) return res.status(401).json({ message: "Invalid credentials" });
      const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } else {
      const user = inMemoryUsers.find(u => u.email === email);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) return res.status(401).json({ message: "Invalid credentials" });
      const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ message: "Login successful", token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

module.exports = router;
