const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "users.json");

function loadUsersFromDisk() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }

    const raw = fs.readFileSync(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Could not load fallback users from disk:", error.message);
    return [];
  }
}

function persistInMemoryUsers() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(inMemoryUsers, null, 2), "utf8");
  } catch (error) {
    console.error("Could not persist fallback users to disk:", error.message);
  }
}

function findInMemoryUserByEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  return inMemoryUsers.find((u) => String(u.email || "").trim().toLowerCase() === normalized);
}

// This acts as a temporary "scratchpad" for the app if the main database is offline
const inMemoryUsers = loadUsersFromDisk();
const inMemoryProposals = [];

// We seed some sample data so the Water Usage page doesn't look empty for new users
const inMemoryWaterUsage = [
  { _id: "1", id: 1, field: "Wheat Field", litersUsed: 1200, status: "Optimal", createdAt: new Date() },
  { _id: "2", id: 2, field: "Rice Field", litersUsed: 1800, status: "High", createdAt: new Date() },
  { _id: "3", id: 3, field: "Corn Field", litersUsed: 900, status: "Low", createdAt: new Date() },
];

module.exports = {
  inMemoryUsers,
  inMemoryProposals,
  inMemoryWaterUsage,
  persistInMemoryUsers,
  findInMemoryUserByEmail,
};
