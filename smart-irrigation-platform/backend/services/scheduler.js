/**
 * Smart Irrigation Scheduler
 * 
 * Combines weather forecasts, crop needs, sensor data, and soil conditions
 * to generate optimal irrigation schedules.
 * 
 * Scheduling Algorithm:
 * 1. Calculate crop water demand using Kc × ET₀
 * 2. Check weather forecast for upcoming rain
 * 3. Factor in current soil moisture from sensors
 * 4. Determine optimal irrigation time (minimize evaporation)
 * 5. Prioritize fields by drought stress level
 * 6. Generate schedule with exact volume and timing
 */

const { CROP_DATABASE, SOIL_TYPES, getCurrentGrowthStage } = require("./cropDatabase");
const { penmanMonteithET0 } = require("./prediction");

/**
 * Generates a smart irrigation schedule for multiple fields.
 * 
 * @param {object} params
 * @param {Array} params.fields - Array of { name, cropType, soilType, areaHa, plantingDate, currentMoisture }
 * @param {object} params.weather - Weather data with forecast
 * @param {number} params.daysAhead - How many days to schedule (default: 7)
 * @returns {object} Complete schedule with daily recommendations
 */
function generateSchedule({ fields = [], weather = null, daysAhead = 7 } = {}) {
  if (fields.length === 0) {
    // Demo fields for showcase
    fields = [
      { name: "North Wheat Field",  cropType: "wheat",  soilType: "loam",       areaHa: 2.5, plantingDate: getDateDaysAgo(60), currentMoisture: 45 },
      { name: "East Rice Paddy",    cropType: "rice",   soilType: "clay",       areaHa: 1.8, plantingDate: getDateDaysAgo(40), currentMoisture: 72 },
      { name: "South Corn Plot",    cropType: "corn",   soilType: "sandy-loam", areaHa: 3.0, plantingDate: getDateDaysAgo(50), currentMoisture: 38 },
      { name: "West Tomato Garden", cropType: "tomato", soilType: "loam",       areaHa: 0.5, plantingDate: getDateDaysAgo(35), currentMoisture: 55 },
    ];
  }

  const now = new Date();
  const schedule = [];
  let totalWaterScheduled = 0;
  let totalWaterSaved = 0;

  for (let day = 0; day < daysAhead; day++) {
    const scheduleDate = new Date(now);
    scheduleDate.setDate(scheduleDate.getDate() + day);
    const dateStr = scheduleDate.toISOString().split("T")[0];
    const dayName = scheduleDate.toLocaleDateString("en-US", { weekday: "long" });

    // Get weather for this day
    let dayWeather = {
      tempMax: 32 + Math.sin(day * 0.5) * 3,
      tempMin: 22 + Math.sin(day * 0.5) * 2,
      humidity: 55 + Math.random() * 20,
      windSpeed: 3 + Math.random() * 8,
      rainProbability: Math.round(Math.random() * 60),
      rainVolume: 0,
    };

    if (weather && weather.forecast && weather.forecast[day]) {
      dayWeather = {
        tempMax: weather.forecast[day].tempMax || dayWeather.tempMax,
        tempMin: weather.forecast[day].tempMin || dayWeather.tempMin,
        humidity: weather.forecast[day].humidity || dayWeather.humidity,
        windSpeed: weather.forecast[day].windSpeed || dayWeather.windSpeed,
        rainProbability: weather.forecast[day].rainProbability || dayWeather.rainProbability,
        rainVolume: weather.forecast[day].rainVolume || 0,
      };
    }

    // If high rain probability and significant volume, potentially skip
    const rainExpected = dayWeather.rainProbability > 60 && dayWeather.rainVolume > 5;

    // Calculate ET₀ for this day
    const et0 = penmanMonteithET0(
      dayWeather.tempMax,
      dayWeather.tempMin,
      dayWeather.humidity,
      dayWeather.windSpeed
    );

    // Process each field
    const fieldSchedules = fields.map(field => {
      const crop = CROP_DATABASE[field.cropType.toLowerCase()] || CROP_DATABASE.wheat;
      const soil = SOIL_TYPES[field.soilType] || SOIL_TYPES.loam;
      const growthStage = field.plantingDate
        ? getCurrentGrowthStage(field.cropType, field.plantingDate)
        : null;
      
      const kc = growthStage ? growthStage.kc : crop.stages.mid.kc;
      
      // Crop water requirement
      const etc = kc * et0;
      const adjustedEtc = etc * soil.adjustmentFactor;
      const effectiveRain = rainExpected ? dayWeather.rainVolume * 0.8 : 0;
      const netNeed = Math.max(0, adjustedEtc - effectiveRain);
      
      // Convert to liters
      const litersNeeded = Math.round(netNeed * 10000 * field.areaHa);
      
      // Determine moisture deficit
      const optimalMoisture = (crop.optimalSoilMoisture.min + crop.optimalSoilMoisture.max) / 2;
      const moistureDeficit = Math.max(0, optimalMoisture - (field.currentMoisture || 50));
      
      // Priority scoring (higher = more urgent)
      let priority = 0;
      if (moistureDeficit > 20) priority += 3;
      else if (moistureDeficit > 10) priority += 2;
      else if (moistureDeficit > 5) priority += 1;
      
      if (growthStage && crop.criticalStages.includes(growthStage.stage)) {
        priority += 2; // Critical growth stage gets higher priority
      }
      
      if (crop.droughtTolerance === "low") priority += 1;
      if (dayWeather.tempMax > 35) priority += 1;
      
      // Should we irrigate?
      const shouldIrrigate = !rainExpected && netNeed > 1.5 && moistureDeficit > 3;
      
      // Optimal time
      let optimalTime;
      if (dayWeather.tempMax > 35) {
        optimalTime = { start: "05:00", end: "07:00", reason: "Very hot day — irrigate before sunrise to minimize evaporation" };
      } else if (dayWeather.windSpeed > 12) {
        optimalTime = { start: "18:00", end: "20:00", reason: "High winds expected — irrigate in evening when wind subsides" };
      } else {
        optimalTime = { start: "06:00", end: "08:00", reason: "Standard morning irrigation — optimal absorption, minimal evaporation" };
      }
      
      // Duration estimation (based on flow rate approximation)
      const flowRateLitersPerMinute = 100 * field.areaHa; // Simplified
      const durationMinutes = litersNeeded > 0 ? Math.round(litersNeeded / flowRateLitersPerMinute) : 0;
      
      // Water saved compared to constant maximum irrigation
      const maxDailyUsage = crop.waterRequirement.max * 10000 * field.areaHa;
      const saved = shouldIrrigate ? Math.max(0, maxDailyUsage - litersNeeded) : maxDailyUsage;
      
      if (shouldIrrigate) totalWaterScheduled += litersNeeded;
      totalWaterSaved += saved;
      
      // Simulate moisture updating over days
      field.currentMoisture = shouldIrrigate
        ? Math.min(crop.optimalSoilMoisture.max, field.currentMoisture + adjustedEtc * 0.6)
        : Math.max(15, field.currentMoisture - adjustedEtc * 0.8);
      
      return {
        fieldName: field.name,
        crop: crop.name,
        area: field.areaHa + " ha",
        currentStage: growthStage ? growthStage.stage : "unknown",
        isCriticalStage: growthStage ? crop.criticalStages.includes(growthStage.stage) : false,
        soilMoisture: Math.round(field.currentMoisture),
        optimalMoisture: crop.optimalSoilMoisture,
        et0: Math.round(et0 * 100) / 100,
        cropET: Math.round(etc * 100) / 100,
        netIrrigationNeed: Math.round(netNeed * 100) / 100,
        litersNeeded,
        shouldIrrigate,
        priority,
        priorityLabel: priority >= 4 ? "Critical" : priority >= 2 ? "High" : priority >= 1 ? "Medium" : "Low",
        optimalTime,
        durationMinutes,
        waterSaved: Math.round(saved),
        status: shouldIrrigate ? "scheduled" : rainExpected ? "skipped_rain" : "skipped_sufficient_moisture",
      };
    });

    // Sort by priority (highest first)
    fieldSchedules.sort((a, b) => b.priority - a.priority);

    schedule.push({
      date: dateStr,
      dayName,
      dayNumber: day + 1,
      weather: {
        tempMax: Math.round(dayWeather.tempMax * 10) / 10,
        tempMin: Math.round(dayWeather.tempMin * 10) / 10,
        humidity: Math.round(dayWeather.humidity),
        windSpeed: Math.round(dayWeather.windSpeed * 10) / 10,
        rainProbability: dayWeather.rainProbability,
        rainVolume: Math.round((dayWeather.rainVolume || 0) * 10) / 10,
        rainExpected,
      },
      et0: Math.round(penmanMonteithET0(dayWeather.tempMax, dayWeather.tempMin, dayWeather.humidity, dayWeather.windSpeed) * 100) / 100,
      fields: fieldSchedules,
      totalLitersForDay: fieldSchedules.reduce((sum, f) => sum + (f.shouldIrrigate ? f.litersNeeded : 0), 0),
      fieldsToIrrigate: fieldSchedules.filter(f => f.shouldIrrigate).length,
      fieldsSkipped: fieldSchedules.filter(f => !f.shouldIrrigate).length,
    });
  }

  return {
    generatedAt: now.toISOString(),
    daysScheduled: daysAhead,
    fieldCount: fields.length,
    schedule,
    summary: {
      totalWaterScheduled: Math.round(totalWaterScheduled),
      totalWaterSaved: Math.round(totalWaterSaved),
      savingsPercent: totalWaterScheduled + totalWaterSaved > 0
        ? Math.round((totalWaterSaved / (totalWaterScheduled + totalWaterSaved)) * 100)
        : 0,
      avgDailyUsage: Math.round(totalWaterScheduled / daysAhead),
      irrigationDays: schedule.filter(d => d.fieldsToIrrigate > 0).length,
      skipDays: schedule.filter(d => d.fieldsToIrrigate === 0).length,
    },
    algorithm: "Multi-factor optimization: Penman-Monteith ET₀ × Crop Kc × Soil Factor + Weather Adjustment + Priority Scoring",
  };
}

function getDateDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

module.exports = {
  generateSchedule,
};
