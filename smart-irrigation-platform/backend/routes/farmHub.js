const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/authorize");
const { ResourceRepository } = require("../repositories/resourceRepository");
const Farm = require("../models/Farm");
const Crop = require("../models/Crop");
const SoilReading = require("../models/SoilReading");
const WeatherReport = require("../models/WeatherReport");
const IrrigationSchedule = require("../models/IrrigationSchedule");
const Task = require("../models/Task");
const Alert = require("../models/Alert");
const AnalyticsRecord = require("../models/AnalyticsRecord");
const { inMemoryUsers } = require("../storage/inMemory");
const { asyncHandler, fail, getPagination, optionalArray, optionalBoolean, optionalDate, optionalEnum, optionalNumber, optionalString, pickDefined, requireNumber, requireString } = require("../utils/api");

const router = express.Router();
router.use(authenticateToken);

const repositories = {
  farms: new ResourceRepository({ collection: "farms", Model: Farm }),
  crops: new ResourceRepository({ collection: "crops", Model: Crop }),
  soilReadings: new ResourceRepository({ collection: "soilReadings", Model: SoilReading, defaultSort: { recordedAt: -1 } }),
  weatherReports: new ResourceRepository({ collection: "weatherReports", Model: WeatherReport, defaultSort: { observedAt: -1 } }),
  irrigationSchedules: new ResourceRepository({ collection: "irrigationSchedules", Model: IrrigationSchedule, defaultSort: { scheduledDate: -1 } }),
  tasks: new ResourceRepository({ collection: "tasks", Model: Task, defaultSort: { dueDate: 1 } }),
  alerts: new ResourceRepository({ collection: "alerts", Model: Alert, defaultSort: { createdAt: -1 } }),
  analyticsRecords: new ResourceRepository({ collection: "analyticsRecords", Model: AnalyticsRecord, defaultSort: { recordedOn: -1 } }),
};

const field = (body, key, required, options = {}) => required ? requireString(body[key], key, options) : optionalString(body[key], key, options);
const farmId = (body, required) => field(body, "farmId", required, { max: 100 });
const date = (body, key) => optionalDate(body[key], key);

function farmPayload(body, required) {
  return pickDefined({ name: field(body, "name", required, { min: 2, max: 120 }), ownerId: body.ownerId, location: body.location, sizeHectares: optionalNumber(body.sizeHectares, "sizeHectares", { min: 0, max: 100000 }), soilType: field(body, "soilType", false, { max: 80 }), status: optionalEnum(body.status, "status", ["active", "inactive", "archived"]), tags: optionalArray(body.tags, "tags", { max: 16 }), settings: body.settings });
}
function cropPayload(body, required) {
  return pickDefined({ farmId: farmId(body, required), name: field(body, "name", required, { min: 2, max: 100 }), variety: field(body, "variety", false, { max: 100 }), areaHectares: optionalNumber(body.areaHectares, "areaHectares", { min: 0 }), plantedOn: date(body, "plantedOn"), expectedHarvestDate: date(body, "expectedHarvestDate"), growthStage: optionalEnum(body.growthStage, "growthStage", ["planned", "germination", "vegetative", "flowering", "fruiting", "harvest-ready", "harvested"]), health: optionalEnum(body.health, "health", ["excellent", "good", "watch", "at-risk"]), progress: optionalNumber(body.progress, "progress", { min: 0, max: 100 }), estimatedYieldKg: optionalNumber(body.estimatedYieldKg, "estimatedYieldKg", { min: 0 }), notes: field(body, "notes", false, { max: 2000 }) });
}
function soilPayload(body, required) {
  return pickDefined({ farmId: farmId(body, required), cropId: field(body, "cropId", false, { max: 100 }), moisture: required ? requireNumber(body.moisture, "moisture", { min: 0, max: 100 }) : optionalNumber(body.moisture, "moisture", { min: 0, max: 100 }), ph: optionalNumber(body.ph, "ph", { min: 0, max: 14 }), temperatureC: optionalNumber(body.temperatureC, "temperatureC", { min: -50, max: 100 }), nitrogen: optionalNumber(body.nitrogen, "nitrogen", { min: 0 }), phosphorus: optionalNumber(body.phosphorus, "phosphorus", { min: 0 }), potassium: optionalNumber(body.potassium, "potassium", { min: 0 }), electricalConductivity: optionalNumber(body.electricalConductivity, "electricalConductivity", { min: 0 }), source: optionalEnum(body.source, "source", ["sensor", "manual", "import"]), recordedAt: date(body, "recordedAt") });
}
function weatherPayload(body, required) {
  return pickDefined({ farmId: farmId(body, required), location: field(body, "location", false, { max: 160 }), observedAt: date(body, "observedAt"), condition: field(body, "condition", false, { max: 100 }), temperatureC: optionalNumber(body.temperatureC, "temperatureC", { min: -50, max: 100 }), humidity: optionalNumber(body.humidity, "humidity", { min: 0, max: 100 }), rainfallMm: optionalNumber(body.rainfallMm, "rainfallMm", { min: 0 }), rainChance: optionalNumber(body.rainChance, "rainChance", { min: 0, max: 100 }), windKph: optionalNumber(body.windKph, "windKph", { min: 0 }), alertLevel: optionalEnum(body.alertLevel, "alertLevel", ["none", "watch", "warning", "critical"]), forecast: Array.isArray(body.forecast) ? body.forecast : undefined });
}
function irrigationPayload(body, required) {
  return pickDefined({ farmId: farmId(body, required), cropId: field(body, "cropId", false, { max: 100 }), fieldName: field(body, "fieldName", required, { min: 2, max: 120 }), cropType: field(body, "cropType", required, { min: 2, max: 100 }), soilType: field(body, "soilType", false, { max: 80 }), areaHectares: optionalNumber(body.areaHectares, "areaHectares", { min: 0 }), scheduledDate: required ? date(body, "scheduledDate") || new Date().toISOString() : date(body, "scheduledDate"), startTime: field(body, "startTime", false, { max: 12 }), endTime: field(body, "endTime", false, { max: 12 }), durationMinutes: optionalNumber(body.durationMinutes, "durationMinutes", { min: 1, max: 1440 }), waterVolumeLiters: optionalNumber(body.waterVolumeLiters, "waterVolumeLiters", { min: 0 }), priority: optionalEnum(body.priority, "priority", ["Critical", "High", "Medium", "Low"]), status: optionalEnum(body.status, "status", ["scheduled", "completed", "skipped_rain", "skipped_sufficient_moisture", "cancelled"]), mode: optionalEnum(body.mode, "mode", ["auto", "manual"]), enabled: optionalBoolean(body.enabled, "enabled"), repeat: optionalEnum(body.repeat, "repeat", ["once", "daily", "weekly", "custom"]) });
}
function taskPayload(body, required) {
  return pickDefined({ farmId: farmId(body, required), cropId: field(body, "cropId", false, { max: 100 }), title: field(body, "title", required, { min: 2, max: 160 }), dueDate: required ? date(body, "dueDate") || new Date().toISOString() : date(body, "dueDate"), type: optionalEnum(body.type, "type", ["planting", "spraying", "watering", "harvesting", "inspection", "other"]), status: optionalEnum(body.status, "status", ["todo", "in_progress", "completed", "overdue"]), priority: optionalEnum(body.priority, "priority", ["low", "medium", "high", "critical"]), assignedTo: field(body, "assignedTo", false, { max: 120 }), reminderAt: date(body, "reminderAt"), notes: field(body, "notes", false, { max: 2000 }) });
}
function alertPayload(body, required) {
  return pickDefined({ farmId: farmId(body, required), cropId: field(body, "cropId", false, { max: 100 }), type: optionalEnum(body.type, "type", ["low_moisture", "bad_weather", "pest_risk", "overdue_task", "system"]), severity: optionalEnum(body.severity, "severity", ["low", "medium", "high", "critical"]), title: field(body, "title", required, { min: 2, max: 160 }), message: field(body, "message", required, { min: 2, max: 1000 }), status: optionalEnum(body.status, "status", ["active", "acknowledged", "resolved"]), actionable: optionalBoolean(body.actionable, "actionable") });
}
function analyticsPayload(body, required) {
  return pickDefined({ farmId: farmId(body, required), cropId: field(body, "cropId", false, { max: 100 }), recordedOn: date(body, "recordedOn"), yieldKg: optionalNumber(body.yieldKg, "yieldKg", { min: 0 }), expenseAmount: optionalNumber(body.expenseAmount, "expenseAmount", { min: 0 }), revenueAmount: optionalNumber(body.revenueAmount, "revenueAmount", { min: 0 }), waterUsedLiters: optionalNumber(body.waterUsedLiters, "waterUsedLiters", { min: 0 }), moistureAverage: optionalNumber(body.moistureAverage, "moistureAverage", { min: 0, max: 100 }), performanceScore: optionalNumber(body.performanceScore, "performanceScore", { min: 0, max: 100 }), metrics: body.metrics });
}

function mount(path, repository, payload) {
  router.get(path, asyncHandler(async (req, res) => { const paging = getPagination(req.query); const filter = {}; ["farmId", "cropId", "status"].forEach((key) => { if (req.query[key]) filter[key] = req.query[key]; }); const result = await repository.list(filter, paging); res.json({ data: result.items, meta: { page: paging.page, limit: paging.limit, total: result.total } }); }));
  router.post(path, asyncHandler(async (req, res) => { const record = await repository.create(payload(req.body, true)); res.status(201).json({ data: record }); }));
  router.get(path + "/:id", asyncHandler(async (req, res) => { const record = await repository.findById(req.params.id); if (!record) fail(404, "NOT_FOUND", "Resource not found"); res.json({ data: record }); }));
  router.patch(path + "/:id", asyncHandler(async (req, res) => { const record = await repository.update(req.params.id, payload(req.body, false)); if (!record) fail(404, "NOT_FOUND", "Resource not found"); res.json({ data: record }); }));
  router.delete(path + "/:id", asyncHandler(async (req, res) => { const record = await repository.remove(req.params.id); if (!record) fail(404, "NOT_FOUND", "Resource not found"); res.status(204).send(); }));
}

mount("/farms", repositories.farms, farmPayload);
mount("/farm-crops", repositories.crops, cropPayload);
mount("/soil-readings", repositories.soilReadings, soilPayload);
mount("/weather-reports", repositories.weatherReports, weatherPayload);
mount("/irrigation-schedules", repositories.irrigationSchedules, irrigationPayload);
mount("/tasks", repositories.tasks, taskPayload);
mount("/alerts", repositories.alerts, alertPayload);
mount("/analytics-records", repositories.analyticsRecords, analyticsPayload);

router.get("/dashboard/:farmId", asyncHandler(async (req, res) => {
  const farm = await repositories.farms.findById(req.params.farmId);
  if (!farm) fail(404, "NOT_FOUND", "Farm not found");
  const filter = { farmId: req.params.farmId };
  const results = await Promise.all([repositories.crops.list(filter, { limit: 20 }), repositories.soilReadings.list(filter, { limit: 12 }), repositories.weatherReports.list(filter, { limit: 1 }), repositories.irrigationSchedules.list(filter, { limit: 20 }), repositories.tasks.list(filter, { limit: 20 }), repositories.alerts.list(filter, { limit: 20 }), repositories.analyticsRecords.list(filter, { limit: 40 })]);
  res.json({ data: { farm, crops: results[0].items, soilReadings: results[1].items, weatherReports: results[2].items, irrigationSchedules: results[3].items, tasks: results[4].items, alerts: results[5].items, analyticsRecords: results[6].items } });
}));

router.get("/admin/summary", authorizeRoles("admin"), asyncHandler(async (req, res) => {
  const results = await Promise.all([repositories.farms.list({}, { limit: 100 }), repositories.alerts.list({ status: "active" }, { limit: 100 }), repositories.tasks.list({}, { limit: 100 })]);
  res.json({ data: { users: inMemoryUsers.map(({ password, ...user }) => user), farmCount: results[0].total, activeAlerts: results[1].total, overdueTasks: results[2].items.filter((task) => task.status === "overdue").length } });
}));
router.get("/admin/users", authorizeRoles("admin"), (req, res) => res.json({ data: inMemoryUsers.map(({ password, ...user }) => user) }));

module.exports = router;
