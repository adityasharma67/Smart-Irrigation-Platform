const express = require("express");
const router = express.Router();
const { isMongoConnected } = require("../db/index.js");
const WaterUsage = require("../models/WaterUsage");
const { inMemoryWaterUsage } = require("../storage/inMemory");
const { authenticateToken } = require("../middleware/auth");
const mongoose = require("mongoose");

// Get water usage
router.get("/", async (req, res) => {
  try {
    if (isMongoConnected()) {
      const waterUsage = await WaterUsage.find().sort({ createdAt: -1 });
      res.json(waterUsage);
    } else {
      res.json(inMemoryWaterUsage);
    }
  } catch (error) {
    console.error("Error fetching water usage:", error);
    res.status(500).json({ message: "Error fetching water usage", error: error.message });
  }
});

// Create water usage
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { field, litersUsed, status } = req.body;
    if (!field || !litersUsed) return res.status(400).json({ message: "Field and litersUsed are required" });

    if (isMongoConnected()) {
      const waterUsage = new WaterUsage({ field, litersUsed, status: status || "Optimal", userId: req.user.userId });
      await waterUsage.save();
      res.status(201).json(waterUsage);
    } else {
      const newUsage = { _id: Date.now().toString(), id: Date.now(), field, litersUsed: parseFloat(litersUsed), status: status || "Optimal", createdAt: new Date() };
      inMemoryWaterUsage.push(newUsage);
      res.status(201).json(newUsage);
    }
  } catch (error) {
    console.error("Error creating water usage:", error);
    res.status(500).json({ message: "Error creating water usage", error: error.message });
  }
});

// Delete water usage entry
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    let deletedSomething = false;

    if (isMongoConnected()) {
      // Only attempt Mongo deletion for valid ObjectId values to avoid CastErrors
      if (mongoose.Types.ObjectId.isValid(id)) {
        const deleted = await WaterUsage.findByIdAndDelete(id);
        if (deleted) {
          deletedSomething = true;
        }
      }
    }

    const index = inMemoryWaterUsage.findIndex((w) => String(w._id || w.id) === String(id));
    if (index !== -1) {
      inMemoryWaterUsage.splice(index, 1);
      deletedSomething = true;
    }

    if (!deletedSomething) {
      // If nothing was found in either Mongo or in-memory, still return 200 so UI doesn't break
      return res.json({ message: "Water usage entry already removed or not found" });
    }

    return res.json({ message: "Water usage entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting water usage:", error);
    res.status(500).json({ message: "Error deleting water usage", error: error.message });
  }
});

module.exports = router;
