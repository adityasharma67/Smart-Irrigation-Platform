const express = require("express");
const router = express.Router();
const { isMongoConnected } = require("../db/index.js");
const Proposal = require("../models/Proposal");
const mongoose = require("mongoose");
const { inMemoryProposals, inMemoryUsers } = require("../storage/inMemory");
const { authenticateToken } = require("../middleware/auth");

// This endpoint lets anyone see all the active irrigation proposals
router.get("/", async (req, res) => {
  try {
    if (isMongoConnected()) {
      // We fetch active proposals and include the contact details of the provider for each
      const proposals = await Proposal.find({ status: "active" })
        .populate("proposer", "name email role location")
        .sort({ createdAt: -1 });
      res.json(proposals);
    } else {
      // If the database is busy or offline, we use our temporary in-memory list
      res.json(inMemoryProposals);
    }
  } catch (error) {
    console.error("Error fetching proposals:", error);
    res.status(500).json({ message: "Something went wrong while fetching proposals", error: error.message });
  }
});

// This endpoint allows authenticated service providers to create new service offers
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, price, targetCrops } = req.body;
    
    // Every proposal needs a clear title and a set price
    if (!title || !price) return res.status(400).json({ message: "Please provide both a title and a price for your proposal" });

    if (isMongoConnected()) {
      // We save the new proposal and link it directly to the dashboard of the provider who made it
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
      // Temporary fallback: Add to our volatile storage for demo purposes
      const user = inMemoryUsers.find(u => u.id === req.user.userId);
      if (!user) return res.status(404).json({ message: "User not found in temporary storage" });
      
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
    res.status(500).json({ message: "Could not create your proposal at this time", error: error.message });
  }
});

// This endpoint is for removing old or irrelevant proposals
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    let deletedSomething = false;

    if (isMongoConnected()) {
      // Only attempt a database delete if the ID format looks legitimate
      if (mongoose.Types.ObjectId.isValid(id)) {
        const deleted = await Proposal.findByIdAndDelete(id);
        if (deleted) {
          deletedSomething = true;
        }
      }
    }

    // We also double-check our temporary list just in case it was a new demo entry
    const index = inMemoryProposals.findIndex((p) => String(p._id || p.id) === String(id));
    if (index !== -1) {
      inMemoryProposals.splice(index, 1);
      deletedSomething = true;
    }

    if (!deletedSomething) {
      // If it's already gone, we let the user know
      return res.json({ message: "That proposal was already removed or doesn't exist" });
    }

    return res.json({ message: "Proposal successfully removed from the platform" });
  } catch (error) {
    console.error("Error deleting proposal:", error);
    res.status(500).json({ message: "Could not remove the proposal", error: error.message });
  }
});

module.exports = router;
