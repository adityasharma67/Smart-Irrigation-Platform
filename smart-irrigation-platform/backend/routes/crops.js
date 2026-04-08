const express = require("express");
const router = express.Router();
const { getAllCrops, getCropDetails, calculateWaterRequirement, SOIL_TYPES } = require("../services/cropDatabase");

// Returns a summary of all supported crops in the database
router.get("/", (req, res) => {
  try {
    const crops = getAllCrops();
    res.json({
      count: crops.length,
      crops,
      soilTypes: Object.entries(SOIL_TYPES).map(([key, soil]) => ({
        key,
        name: soil.name,
        waterHolding: soil.waterHolding,
        description: soil.description,
      })),
    });
  } catch (error) {
    console.error("Error fetching crops:", error);
    res.status(500).json({ message: "Could not fetch crop data", error: error.message });
  }
});

// Returns full details for a specific crop
router.get("/:cropName", (req, res) => {
  try {
    const crop = getCropDetails(req.params.cropName);
    if (!crop) {
      return res.status(404).json({ message: `Crop '${req.params.cropName}' not found in our database` });
    }
    res.json(crop);
  } catch (error) {
    console.error("Error fetching crop details:", error);
    res.status(500).json({ message: "Could not fetch crop details", error: error.message });
  }
});

// Calculates detailed irrigation recommendation for a specific crop
router.get("/:cropName/recommendation", (req, res) => {
  try {
    const { soilType, area, plantingDate, et0 } = req.query;
    const result = calculateWaterRequirement(
      req.params.cropName,
      soilType || "loam",
      parseFloat(area) || 1,
      plantingDate || null,
      parseFloat(et0) || 5.0
    );

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }

    res.json(result);
  } catch (error) {
    console.error("Error calculating recommendation:", error);
    res.status(500).json({ message: "Could not calculate recommendation", error: error.message });
  }
});

// Calculates precise water needs given crop, soil, area, and planting date
router.post("/calculate", (req, res) => {
  try {
    const { cropType, soilType, areaHectares, plantingDate, et0 } = req.body;

    if (!cropType) {
      return res.status(400).json({ message: "Please specify a crop type" });
    }

    const result = calculateWaterRequirement(
      cropType,
      soilType || "loam",
      parseFloat(areaHectares) || 1,
      plantingDate || null,
      parseFloat(et0) || 5.0
    );

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }

    res.json(result);
  } catch (error) {
    console.error("Error in water calculation:", error);
    res.status(500).json({ message: "Could not calculate water requirements", error: error.message });
  }
});

module.exports = router;
