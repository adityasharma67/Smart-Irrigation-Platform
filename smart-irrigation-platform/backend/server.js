const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/smart-irrigation";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.log("⚠️  MongoDB not available, using in-memory storage");
    console.log("   To use MongoDB, install it and set MONGODB_URI in .env");
  });

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["farmer", "provider", "manufacturer"], default: "farmer" },
  location: String,
  cropType: String,
}, { timestamps: true });

// Proposal Schema
const proposalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  targetCrops: [String],
  proposer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" },
}, { timestamps: true });

// Water Usage Schema
const waterUsageSchema = new mongoose.Schema({
  field: { type: String, required: true },
  litersUsed: { type: Number, required: true },
  status: { type: String, enum: ["Optimal", "High", "Low"], default: "Optimal" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Proposal = mongoose.models.Proposal || mongoose.model("Proposal", proposalSchema);
const WaterUsage = mongoose.models.WaterUsage || mongoose.model("WaterUsage", waterUsageSchema);

// In-memory fallback storage
let inMemoryUsers = [];
let inMemoryProposals = [];
let inMemoryWaterUsage = [
  { _id: "1", id: 1, field: "Wheat Field", litersUsed: 1200, status: "Optimal", createdAt: new Date() },
  { _id: "2", id: 2, field: "Rice Field", litersUsed: 1800, status: "High", createdAt: new Date() },
  { _id: "3", id: 3, field: "Corn Field", litersUsed: 900, status: "Low", createdAt: new Date() },
];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Helper function to check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role, location, cropType } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (isMongoConnected()) {
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: role || "farmer",
        location,
        cropType,
      });

      await user.save();

      // Generate token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        message: "Registration successful",
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } else {
      // In-memory fallback
      if (inMemoryUsers.find(u => u.email === email)) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
        role: role || "farmer",
        location,
        cropType,
      };

      inMemoryUsers.push(newUser);

      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        message: "Registration successful",
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (isMongoConnected()) {
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } else {
      // In-memory fallback
      const user = inMemoryUsers.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// Proposals Routes
app.get("/api/proposals", async (req, res) => {
  try {
    if (isMongoConnected()) {
      const proposals = await Proposal.find({ status: "active" })
        .populate("proposer", "name email")
        .sort({ createdAt: -1 });
      res.json(proposals);
    } else {
      // In-memory fallback
      res.json(inMemoryProposals);
    }
  } catch (error) {
    console.error("Error fetching proposals:", error);
    res.status(500).json({ message: "Error fetching proposals", error: error.message });
  }
});

app.post("/api/proposals", authenticateToken, async (req, res) => {
  try {
    const { title, description, price, targetCrops } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title and price are required" });
    }

    if (isMongoConnected()) {
      const proposal = new Proposal({
        title,
        description,
        price,
        targetCrops: targetCrops || [],
        proposer: req.user.userId,
      });

      await proposal.save();
      await proposal.populate("proposer", "name email");

      res.status(201).json(proposal);
    } else {
      // In-memory fallback
      const user = inMemoryUsers.find(u => u.id === req.user.userId);
      const newProposal = {
        _id: Date.now().toString(),
        title,
        description,
        price,
        targetCrops: targetCrops || [],
        proposer: { _id: user.id, name: user.name, email: user.email },
        status: "active",
        createdAt: new Date(),
      };

      inMemoryProposals.push(newProposal);
      res.status(201).json(newProposal);
    }
  } catch (error) {
    console.error("Error creating proposal:", error);
    res.status(500).json({ message: "Error creating proposal", error: error.message });
  }
});

// Water Usage Routes
app.get("/api/water-usage", async (req, res) => {
  try {
    if (isMongoConnected()) {
      const waterUsage = await WaterUsage.find().sort({ createdAt: -1 });
      res.json(waterUsage);
    } else {
      // In-memory fallback
      res.json(inMemoryWaterUsage);
    }
  } catch (error) {
    console.error("Error fetching water usage:", error);
    res.status(500).json({ message: "Error fetching water usage", error: error.message });
  }
});

app.post("/api/water-usage", authenticateToken, async (req, res) => {
  try {
    const { field, litersUsed, status } = req.body;

    if (!field || !litersUsed) {
      return res.status(400).json({ message: "Field and litersUsed are required" });
    }

    if (isMongoConnected()) {
      const waterUsage = new WaterUsage({
        field,
        litersUsed,
        status: status || "Optimal",
        userId: req.user.userId,
      });

      await waterUsage.save();
      res.status(201).json(waterUsage);
    } else {
      // In-memory fallback
      const newUsage = {
        _id: Date.now().toString(),
        id: Date.now(),
        field,
        litersUsed: parseFloat(litersUsed),
        status: status || "Optimal",
        createdAt: new Date(),
      };

      inMemoryWaterUsage.push(newUsage);
      res.status(201).json(newUsage);
    }
  } catch (error) {
    console.error("Error creating water usage:", error);
    res.status(500).json({ message: "Error creating water usage", error: error.message });
  }
});

// Users Route (for testing)
app.get("/api/users", async (req, res) => {
  try {
    if (isMongoConnected()) {
      const users = await User.find().select("-password");
      res.json(users);
    } else {
      // In-memory fallback
      const users = inMemoryUsers.map(({ password, ...user }) => user);
      res.json(users);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mongoConnected: isMongoConnected() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 MongoDB: ${isMongoConnected() ? "Connected" : "Not connected (using in-memory storage)"}`);
});
