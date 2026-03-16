const express = require("express");
const router = express.Router();
const { isMongoConnected } = require("../db/index.js");
const WaterUsage = require("../models/WaterUsage");
const { inMemoryWaterUsage } = require("../storage/inMemory");
const { authenticateToken } = require("../middleware/auth");
const mongoose = require("mongoose");

// This endpoint retrieves the full history of water used in the fields
router.get("/", async (req, res) => {
  try {
    if (isMongoConnected()) {
      // We pull the most recent records from our database first
      const waterUsage = await WaterUsage.find().sort({ createdAt: -1 });
      res.json(waterUsage);
    } else {
      // If the database is busy, we show the temporary list from this session
      res.json(inMemoryWaterUsage);
    }
  } catch (error) {
    console.error("Error fetching water usage:", error);
    res.status(500).json({ message: "We couldn't retrieve the water usage data", error: error.message });
  }
});

// This endpoint allows farmers to record a new batch of water usage
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { field, litersUsed, status } = req.body;
    
    // To record usage, we need to know where it happened and how much was used
    if (!field || !litersUsed) return res.status(400).json({ message: "Please specify the field name and the amount of water used" });

    if (isMongoConnected()) {
      // We log the details in the database and link them to the logged-in farmer
      const waterUsage = new WaterUsage({ field, litersUsed, status: status || "Optimal", userId: req.user.userId });
      await waterUsage.save();
      res.status(201).json(waterUsage);
    } else {
      // Temporary fallback: Log it in our volatile storage for now
      const newUsage = { _id: Date.now().toString(), id: Date.now(), field, litersUsed: parseFloat(litersUsed), status: status || "Optimal", createdAt: new Date() };
      inMemoryWaterUsage.push(newUsage);
      res.status(201).json(newUsage);
    }
  } catch (error) {
    console.error("Error creating water usage:", error);
    res.status(500).json({ message: "Could not save the water usage record", error: error.message });
  }
});

// This endpoint is for removing incorrect or outdated usage entries
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    let deletedSomething = false;

    if (isMongoConnected()) {
      // Only attempt a database delete if the ID format is correct
      if (mongoose.Types.ObjectId.isValid(id)) {
        const deleted = await WaterUsage.findByIdAndDelete(id);
        if (deleted) {
          deletedSomething = true;
        }
      }
    }

    // We also check our temporary list to be safe
    const index = inMemoryWaterUsage.findIndex((w) => String(w._id || w.id) === String(id));
    if (index !== -1) {
      inMemoryWaterUsage.splice(index, 1);
      deletedSomething = true;
    }

    if (!deletedSomething) {
      // If it's already gone, we let the farmer know
      return res.json({ message: "That water usage entry was already removed or doesn't exist" });
    }

    return res.json({ message: "Entry successfully removed from your history" });
  } catch (error) {
    console.error("Error deleting water usage:", error);
    res.status(500).json({ message: "Could not remove the entry at this time", error: error.message });
  }
});

module.exports = router;
