const express = require("express");
const router = express.Router();
const { generateSchedule } = require("../services/scheduler");
const { getCurrentWeather } = require("../services/weather");
const { authenticateToken } = require("../middleware/auth");

// Returns the smart irrigation schedule for the user
router.get("/:userId", async (req, res) => {
  try {
    const { location, days } = req.query;
    
    let weather = null;
    if (location) {
      weather = await getCurrentWeather(location);
    }

    const schedule = generateSchedule({
      daysAhead: parseInt(days) || 7,
      weather,
    });

    res.json(schedule);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ message: "Could not generate schedule", error: error.message });
  }
});

// Generates a new schedule based on provided field data
router.post("/generate", async (req, res) => {
  try {
    const { fields, location, daysAhead } = req.body;

    let weather = null;
    if (location) {
      weather = await getCurrentWeather(location);
    }

    const schedule = generateSchedule({
      fields: fields || [],
      weather,
      daysAhead: parseInt(daysAhead) || 7,
    });

    res.json(schedule);
  } catch (error) {
    console.error("Error generating schedule:", error);
    res.status(500).json({ message: "Could not generate schedule", error: error.message });
  }
});

// Updates a schedule entry status (completed, skipped, etc.)
router.put("/:id/status", authenticateToken, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["scheduled", "completed", "skipped_rain", "skipped_sufficient_moisture", "cancelled"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }

    // In a production system, this would update the database record
    res.json({ 
      id: req.params.id, 
      status, 
      message: "Schedule status updated successfully",
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ message: "Could not update schedule", error: error.message });
  }
});

module.exports = router;
