const express = require("express");
const router = express.Router();
const { isMongoConnected } = require("../db/index.js");
const Proposal = require("../models/Proposal");
const mongoose = require("mongoose");
const { inMemoryProposals, inMemoryUsers } = require("../storage/inMemory");
const { authenticateToken } = require("../middleware/auth");

// Get active proposals
router.get("/", async (req, res) => {
  try {
    if (isMongoConnected()) {
      // populate additional proposer fields so frontend (farmers) can see contact details
      const proposals = await Proposal.find({ status: "active" })
        .populate("proposer", "name email role location")
        .sort({ createdAt: -1 });
      res.json(proposals);
    } else {
      res.json(inMemoryProposals);
    }
  } catch (error) {
    console.error("Error fetching proposals:", error);
    res.status(500).json({ message: "Error fetching proposals", error: error.message });
  }
});

// Create proposal
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, price, targetCrops } = req.body;
    if (!title || !price) return res.status(400).json({ message: "Title and price are required" });

    if (isMongoConnected()) {
      const proposal = new Proposal({
        title,
        description,
        price,
        targetCrops: targetCrops || [],
        proposer: req.user.userId,
      });
      await proposal.save();
      await proposal.populate("proposer", "name email role location");
      res.status(201).json(proposal);
    } else {
      const user = inMemoryUsers.find(u => u.id === req.user.userId);
      const newProposal = {
        _id: Date.now().toString(),
        title,
        description,
        price,
        targetCrops: targetCrops || [],
        proposer: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || "provider",
          location: user.location || "",
        },
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

// Delete proposal
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    let deletedSomething = false;

    if (isMongoConnected()) {
      // Only attempt Mongo deletion for valid ObjectId values to avoid CastErrors
      if (mongoose.Types.ObjectId.isValid(id)) {
        const deleted = await Proposal.findByIdAndDelete(id);
        if (deleted) {
          deletedSomething = true;
        }
      }
    }

    const index = inMemoryProposals.findIndex((p) => String(p._id || p.id) === String(id));
    if (index !== -1) {
      inMemoryProposals.splice(index, 1);
      deletedSomething = true;
    }

    if (!deletedSomething) {
      // If nothing was found in either Mongo or in-memory, still return 200 so UI doesn't break
      return res.json({ message: "Proposal already removed or not found" });
    }

    return res.json({ message: "Proposal deleted successfully" });
  } catch (error) {
    console.error("Error deleting proposal:", error);
    res.status(500).json({ message: "Error deleting proposal", error: error.message });
  }
});

module.exports = router;
