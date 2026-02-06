// In-memory fallback storage
const inMemoryUsers = [];
const inMemoryProposals = [];
const inMemoryWaterUsage = [
  { _id: "1", id: 1, field: "Wheat Field", litersUsed: 1200, status: "Optimal", createdAt: new Date() },
  { _id: "2", id: 2, field: "Rice Field", litersUsed: 1800, status: "High", createdAt: new Date() },
  { _id: "3", id: 3, field: "Corn Field", litersUsed: 900, status: "Low", createdAt: new Date() },
];

module.exports = { inMemoryUsers, inMemoryProposals, inMemoryWaterUsage };
