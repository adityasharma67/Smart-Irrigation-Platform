const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const USERS_FILE = path.join(__dirname, "users.json");
const DEMO_PASSWORD = "Demo@123";

function loadUsersFromDisk() {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    const parsed = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Could not load fallback users from disk:", error.message);
    return [];
  }
}

const inMemoryUsers = loadUsersFromDisk();

function ensureDemoUser(user) {
  if (!inMemoryUsers.some((existing) => String(existing.email).toLowerCase() === user.email)) {
    inMemoryUsers.push(user);
  }
}

// The API remains useful with no database running. These accounts are intentionally
// local/demo-only and are documented in API.md; never use them outside development.
ensureDemoUser({
  id: "demo-farmer-1",
  _id: "demo-farmer-1",
  name: "Aarav Mehta",
  email: "farmer@smartfarming.demo",
  password: bcrypt.hashSync(DEMO_PASSWORD, 8),
  role: "farmer",
  location: "Nashik, Maharashtra",
  cropType: "Tomato",
  createdAt: "2026-08-01T08:00:00.000Z",
});
ensureDemoUser({
  id: "demo-admin-1",
  _id: "demo-admin-1",
  name: "Maya Rao",
  email: "admin@smartfarming.demo",
  password: bcrypt.hashSync(DEMO_PASSWORD, 8),
  role: "admin",
  location: "Pune, Maharashtra",
  createdAt: "2026-08-01T08:00:00.000Z",
});

function persistInMemoryUsers() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(inMemoryUsers, null, 2), "utf8");
  } catch (error) {
    console.error("Could not persist fallback users to disk:", error.message);
  }
}

function findInMemoryUserByEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  return inMemoryUsers.find((user) => String(user.email || "").trim().toLowerCase() === normalized);
}

const now = new Date();
const isoDaysFromNow = (days) => new Date(now.getTime() + days * 86400000).toISOString();
const isoHoursAgo = (hours) => new Date(now.getTime() - hours * 3600000).toISOString();

const inMemoryFarms = [
  {
    id: "farm-demo-1", _id: "farm-demo-1", ownerId: "demo-farmer-1", name: "Green Valley Farm",
    location: { address: "Nashik, Maharashtra", latitude: 19.9975, longitude: 73.7898 },
    sizeHectares: 12.4, soilType: "loam", status: "active", tags: ["drip", "vegetables"],
    settings: { timezone: "Asia/Kolkata", units: "metric" }, createdAt: isoDaysFromNow(-45), updatedAt: isoDaysFromNow(-1),
  },
  {
    id: "farm-demo-2", _id: "farm-demo-2", ownerId: "demo-farmer-1", name: "Riverbend Orchard",
    location: { address: "Sinnar, Maharashtra", latitude: 19.845, longitude: 73.998 },
    sizeHectares: 6.8, soilType: "sandy-loam", status: "active", tags: ["orchard", "sensors"],
    settings: { timezone: "Asia/Kolkata", units: "metric" }, createdAt: isoDaysFromNow(-120), updatedAt: isoDaysFromNow(-2),
  },
];

const inMemoryCrops = [
  { id: "crop-demo-1", _id: "crop-demo-1", farmId: "farm-demo-1", name: "Tomato", variety: "Arka Rakshak", areaHectares: 4.8, plantedOn: isoDaysFromNow(-49), expectedHarvestDate: isoDaysFromNow(36), growthStage: "flowering", health: "excellent", progress: 64, estimatedYieldKg: 26400, notes: "Mulch beds inspected this week.", createdAt: isoDaysFromNow(-49), updatedAt: isoDaysFromNow(-1) },
  { id: "crop-demo-2", _id: "crop-demo-2", farmId: "farm-demo-1", name: "Onion", variety: "N-53", areaHectares: 3.1, plantedOn: isoDaysFromNow(-28), expectedHarvestDate: isoDaysFromNow(70), growthStage: "vegetative", health: "good", progress: 31, estimatedYieldKg: 14800, createdAt: isoDaysFromNow(-28), updatedAt: isoDaysFromNow(-2) },
  { id: "crop-demo-3", _id: "crop-demo-3", farmId: "farm-demo-2", name: "Pomegranate", variety: "Bhagwa", areaHectares: 5.6, plantedOn: isoDaysFromNow(-230), expectedHarvestDate: isoDaysFromNow(54), growthStage: "fruiting", health: "watch", progress: 72, estimatedYieldKg: 19800, notes: "Monitor fruit borer risk after rainfall.", createdAt: isoDaysFromNow(-230), updatedAt: isoDaysFromNow(-1) },
];

const inMemorySoilReadings = [
  { id: "soil-demo-1", _id: "soil-demo-1", farmId: "farm-demo-1", cropId: "crop-demo-1", moisture: 28, ph: 6.7, temperatureC: 24.5, nitrogen: 43, phosphorus: 31, potassium: 176, electricalConductivity: 0.82, source: "sensor", recordedAt: isoHoursAgo(1), createdAt: isoHoursAgo(1), updatedAt: isoHoursAgo(1) },
  { id: "soil-demo-2", _id: "soil-demo-2", farmId: "farm-demo-1", cropId: "crop-demo-2", moisture: 41, ph: 6.4, temperatureC: 23.9, nitrogen: 38, phosphorus: 28, potassium: 162, electricalConductivity: 0.77, source: "sensor", recordedAt: isoHoursAgo(4), createdAt: isoHoursAgo(4), updatedAt: isoHoursAgo(4) },
  { id: "soil-demo-3", _id: "soil-demo-3", farmId: "farm-demo-2", cropId: "crop-demo-3", moisture: 19, ph: 7.1, temperatureC: 26.2, nitrogen: 34, phosphorus: 25, potassium: 190, electricalConductivity: 0.94, source: "sensor", recordedAt: isoHoursAgo(2), createdAt: isoHoursAgo(2), updatedAt: isoHoursAgo(2) },
];

const inMemoryWeatherReports = [
  {
    id: "weather-demo-1", _id: "weather-demo-1", farmId: "farm-demo-1", location: "Nashik, Maharashtra", observedAt: isoHoursAgo(1), condition: "Partly cloudy", temperatureC: 27, humidity: 62, rainfallMm: 0, rainChance: 28, windKph: 13, alertLevel: "none",
    forecast: [
      { date: isoDaysFromNow(1), condition: "Sunny", highC: 31, lowC: 20, rainChance: 12, rainfallMm: 0 },
      { date: isoDaysFromNow(2), condition: "Light rain", highC: 29, lowC: 21, rainChance: 68, rainfallMm: 5.2 },
      { date: isoDaysFromNow(3), condition: "Cloudy", highC: 28, lowC: 20, rainChance: 38, rainfallMm: 1.4 },
    ], createdAt: isoHoursAgo(1), updatedAt: isoHoursAgo(1),
  },
];

const inMemoryIrrigationSchedules = [
  { id: "irrigation-demo-1", _id: "irrigation-demo-1", farmId: "farm-demo-1", cropId: "crop-demo-1", userId: "demo-farmer-1", fieldName: "Tomato Block A", cropType: "Tomato", soilType: "loam", areaHectares: 2.4, scheduledDate: isoDaysFromNow(1), startTime: "05:30", endTime: "06:25", durationMinutes: 55, waterVolumeLiters: 9200, priority: "High", status: "scheduled", mode: "auto", enabled: true, repeat: "daily", reminderMinutesBefore: 30, weatherConditions: { temperature: 29, humidity: 58, windSpeed: 11, rainProbability: 12 }, createdAt: isoDaysFromNow(-3), updatedAt: isoHoursAgo(1) },
  { id: "irrigation-demo-2", _id: "irrigation-demo-2", farmId: "farm-demo-2", cropId: "crop-demo-3", userId: "demo-farmer-1", fieldName: "Orchard North", cropType: "Pomegranate", soilType: "sandy-loam", areaHectares: 3.2, scheduledDate: isoDaysFromNow(1), startTime: "06:00", endTime: "06:42", durationMinutes: 42, waterVolumeLiters: 6800, priority: "Critical", status: "scheduled", mode: "manual", enabled: true, repeat: "weekly", reminderMinutesBefore: 60, weatherConditions: { temperature: 28, humidity: 60, windSpeed: 9, rainProbability: 18 }, createdAt: isoDaysFromNow(-5), updatedAt: isoHoursAgo(2) },
];

const inMemoryTasks = [
  { id: "task-demo-1", _id: "task-demo-1", farmId: "farm-demo-1", cropId: "crop-demo-1", title: "Inspect tomato blossoms", type: "inspection", dueDate: isoDaysFromNow(0), status: "todo", priority: "high", assignedTo: "Aarav", reminderAt: isoHoursAgo(-2), notes: "Check for early blight and pollination.", createdAt: isoDaysFromNow(-2), updatedAt: isoDaysFromNow(-1) },
  { id: "task-demo-2", _id: "task-demo-2", farmId: "farm-demo-2", cropId: "crop-demo-3", title: "Apply pheromone traps", type: "spraying", dueDate: isoDaysFromNow(-1), status: "overdue", priority: "critical", assignedTo: "Field team", reminderAt: isoDaysFromNow(-2), createdAt: isoDaysFromNow(-4), updatedAt: isoDaysFromNow(-1) },
  { id: "task-demo-3", _id: "task-demo-3", farmId: "farm-demo-1", cropId: "crop-demo-2", title: "Calibrate drip lines", type: "watering", dueDate: isoDaysFromNow(3), status: "todo", priority: "medium", assignedTo: "Aarav", createdAt: isoDaysFromNow(-1), updatedAt: isoDaysFromNow(-1) },
];

const inMemoryAlerts = [
  { id: "alert-demo-1", _id: "alert-demo-1", farmId: "farm-demo-2", cropId: "crop-demo-3", type: "low_moisture", severity: "critical", title: "Orchard moisture is below target", message: "Zone N-04 is at 19% moisture. Water within 6 hours to avoid crop stress.", status: "active", actionable: true, createdAt: isoHoursAgo(2), updatedAt: isoHoursAgo(2) },
  { id: "alert-demo-2", _id: "alert-demo-2", farmId: "farm-demo-2", cropId: "crop-demo-3", type: "pest_risk", severity: "high", title: "Fruit borer conditions detected", message: "Humidity and forecast rainfall create elevated pest pressure for the next 48 hours.", status: "acknowledged", actionable: true, createdAt: isoHoursAgo(7), updatedAt: isoHoursAgo(3) },
  { id: "alert-demo-3", _id: "alert-demo-3", farmId: "farm-demo-2", cropId: "crop-demo-3", type: "overdue_task", severity: "high", title: "Pheromone trap task is overdue", message: "The orchard protection task was due yesterday.", status: "active", actionable: true, createdAt: isoHoursAgo(24), updatedAt: isoHoursAgo(24) },
];

const inMemoryAnalyticsRecords = Array.from({ length: 8 }, (_, index) => ({
  id: `analytics-demo-${index + 1}`,
  _id: `analytics-demo-${index + 1}`,
  farmId: "farm-demo-1",
  cropId: "crop-demo-1",
  recordedOn: isoDaysFromNow(index - 7),
  yieldKg: 1800 + index * 165,
  expenseAmount: 4800 + index * 190,
  revenueAmount: 9600 + index * 610,
  waterUsedLiters: 10800 - index * 380,
  moistureAverage: 31 + (index % 3) * 2,
  performanceScore: 74 + index * 2,
  metrics: { diseaseRisk: Math.max(8, 25 - index * 2), irrigationEfficiency: 82 + index },
  createdAt: isoDaysFromNow(index - 7),
  updatedAt: isoDaysFromNow(index - 7),
}));

const inMemoryProposals = [];
const inMemoryWaterUsage = [
  { _id: "1", id: "1", field: "Wheat Field", litersUsed: 1200, status: "Optimal", createdAt: isoDaysFromNow(-2) },
  { _id: "2", id: "2", field: "Rice Field", litersUsed: 1800, status: "High", createdAt: isoDaysFromNow(-1) },
  { _id: "3", id: "3", field: "Corn Field", litersUsed: 900, status: "Low", createdAt: isoDaysFromNow(-1) },
];

const collections = {
  farms: inMemoryFarms,
  crops: inMemoryCrops,
  soilReadings: inMemorySoilReadings,
  weatherReports: inMemoryWeatherReports,
  irrigationSchedules: inMemoryIrrigationSchedules,
  tasks: inMemoryTasks,
  alerts: inMemoryAlerts,
  analyticsRecords: inMemoryAnalyticsRecords,
};

let sequence = 0;
const makeId = (collection) => `${collection}-${Date.now().toString(36)}-${(++sequence).toString(36)}`;
const getInMemoryCollection = (collection) => collections[collection];

function createInMemoryRecord(collection, data) {
  const target = getInMemoryCollection(collection);
  if (!target) throw new Error(`Unknown in-memory collection: ${collection}`);
  const timestamp = new Date().toISOString();
  const id = makeId(collection);
  const record = { id, _id: id, ...data, createdAt: timestamp, updatedAt: timestamp };
  target.push(record);
  return record;
}

function updateInMemoryRecord(collection, id, data) {
  const target = getInMemoryCollection(collection);
  if (!target) throw new Error(`Unknown in-memory collection: ${collection}`);
  const index = target.findIndex((record) => String(record.id || record._id) === String(id));
  if (index === -1) return null;
  target[index] = { ...target[index], ...data, id: target[index].id, _id: target[index]._id, updatedAt: new Date().toISOString() };
  return target[index];
}

function removeInMemoryRecord(collection, id) {
  const target = getInMemoryCollection(collection);
  if (!target) throw new Error(`Unknown in-memory collection: ${collection}`);
  const index = target.findIndex((record) => String(record.id || record._id) === String(id));
  if (index === -1) return null;
  return target.splice(index, 1)[0];
}

module.exports = {
  DEMO_PASSWORD,
  inMemoryUsers,
  inMemoryProposals,
  inMemoryWaterUsage,
  inMemoryFarms,
  inMemoryCrops,
  inMemorySoilReadings,
  inMemoryWeatherReports,
  inMemoryIrrigationSchedules,
  inMemoryTasks,
  inMemoryAlerts,
  inMemoryAnalyticsRecords,
  persistInMemoryUsers,
  findInMemoryUserByEmail,
  getInMemoryCollection,
  createInMemoryRecord,
  updateInMemoryRecord,
  removeInMemoryRecord,
};
