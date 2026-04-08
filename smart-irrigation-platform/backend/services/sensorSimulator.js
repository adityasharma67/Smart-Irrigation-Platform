/**
 * Sensor Data Simulator
 * 
 * Generates realistic IoT sensor data for agricultural monitoring.
 * Since physical sensors aren't available, this simulator produces
 * time-series data with:
 * - Diurnal (day/night) patterns for temperature and humidity
 * - Soil moisture depletion between irrigations
 * - Seasonal variations
 * - Random noise and occasional anomalies
 * 
 * This is essential for demonstrating data analysis capabilities
 * without requiring physical hardware.
 */

/**
 * Generates simulated sensor data for a field over a specified period.
 * 
 * @param {object} params
 * @param {string} params.fieldId - Identifier for the field
 * @param {string} params.cropType - Type of crop (affects moisture patterns)
 * @param {number} params.days - Number of days of historical data to generate
 * @param {number} params.readingsPerDay - Number of sensor readings per day
 * @param {string} params.soilType - Soil type (affects moisture retention)
 * @param {string} params.season - Current season (summer/winter/monsoon/spring)
 * @returns {Array} Array of sensor data points
 */
function generateSensorData({
  fieldId = "field-1",
  cropType = "wheat",
  days = 30,
  readingsPerDay = 4,
  soilType = "loam",
  season = null,
} = {}) {
  // Auto-detect season from current month
  if (!season) {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) season = "spring";
    else if (month >= 5 && month <= 8) season = "summer";
    else if (month >= 9 && month <= 10) season = "monsoon";
    else season = "winter";
  }

  // Season-based temperature and humidity ranges
  const seasonParams = {
    summer:  { tempBase: 35, tempRange: 12, humidityBase: 40, humidityRange: 25, rainChance: 0.05 },
    monsoon: { tempBase: 28, tempRange: 8,  humidityBase: 75, humidityRange: 15, rainChance: 0.40 },
    winter:  { tempBase: 18, tempRange: 10, humidityBase: 55, humidityRange: 20, rainChance: 0.10 },
    spring:  { tempBase: 26, tempRange: 10, humidityBase: 50, humidityRange: 20, rainChance: 0.15 },
  };

  // Soil moisture retention characteristics
  const soilRetention = {
    sandy: { depletionRate: 3.0, maxCapacity: 60 },
    "sandy-loam": { depletionRate: 2.2, maxCapacity: 70 },
    loam: { depletionRate: 1.5, maxCapacity: 80 },
    "silt-loam": { depletionRate: 1.2, maxCapacity: 85 },
    "clay-loam": { depletionRate: 0.9, maxCapacity: 90 },
    clay: { depletionRate: 0.7, maxCapacity: 95 },
  };

  const sp = seasonParams[season] || seasonParams.summer;
  const soilConfig = soilRetention[soilType] || soilRetention.loam;
  
  const data = [];
  const now = new Date();
  let currentMoisture = soilConfig.maxCapacity * 0.7; // Start at 70% of capacity
  let lastIrrigationDay = 0;
  const irrigationInterval = soilType === "sandy" ? 3 : soilType === "clay" ? 6 : 4;
  
  for (let day = days; day >= 0; day--) {
    for (let reading = 0; reading < readingsPerDay; reading++) {
      const timestamp = new Date(now);
      timestamp.setDate(timestamp.getDate() - day);
      const hour = Math.floor((24 / readingsPerDay) * reading) + 6; // Start at 6 AM
      timestamp.setHours(hour, 0, 0, 0);
      
      // Diurnal temperature pattern (sine wave, peak at ~2 PM)
      const hourFraction = (hour - 6) / 24;
      const diurnalFactor = Math.sin(hourFraction * Math.PI);
      const temperature = sp.tempBase - sp.tempRange / 2 + sp.tempRange * diurnalFactor
        + (Math.random() * 3 - 1.5); // Random noise
      
      // Humidity inversely correlated with temperature
      const humidity = sp.humidityBase + sp.humidityRange * (1 - diurnalFactor) * 0.6
        + (Math.random() * 10 - 5);
      
      // Soil moisture depletion with periodic irrigation
      const daysSinceIrrigation = (days - day) - lastIrrigationDay;
      if (daysSinceIrrigation >= irrigationInterval) {
        currentMoisture = Math.min(soilConfig.maxCapacity, currentMoisture + soilConfig.maxCapacity * 0.4);
        lastIrrigationDay = days - day;
      }
      
      // Deplete moisture based on temperature and soil type
      const depletionFactor = 1 + (temperature - 25) * 0.02; // Higher temp = faster depletion
      currentMoisture -= (soilConfig.depletionRate / readingsPerDay) * Math.max(0.5, depletionFactor);
      
      // Rain events
      const isRaining = Math.random() < sp.rainChance / readingsPerDay;
      let rainfall = 0;
      if (isRaining) {
        rainfall = Math.random() * 20 + 2; // 2-22 mm
        currentMoisture = Math.min(soilConfig.maxCapacity, currentMoisture + rainfall * 0.8);
      }
      
      currentMoisture = Math.max(10, Math.min(soilConfig.maxCapacity, currentMoisture));
      
      // Light intensity (lux) — follows sun pattern
      const lightIntensity = hour >= 6 && hour <= 18
        ? Math.round(50000 * Math.sin(((hour - 6) / 12) * Math.PI) * (0.8 + Math.random() * 0.4))
        : Math.round(Math.random() * 50);
      
      // Soil pH (slightly varies)
      const pH = 6.5 + (Math.random() * 1.0 - 0.5);
      
      // Occasional anomalies (sensor malfunction simulation)
      let anomaly = false;
      let anomalyType = null;
      if (Math.random() < 0.01) { // 1% chance
        anomaly = true;
        anomalyType = Math.random() > 0.5 ? "sensor_spike" : "sensor_dropout";
      }
      
      const sensorReading = {
        fieldId,
        cropType,
        timestamp: timestamp.toISOString(),
        soilMoisture: anomaly && anomalyType === "sensor_spike" 
          ? Math.round((currentMoisture * 2) * 100) / 100
          : Math.round(currentMoisture * 100) / 100,
        temperature: anomaly && anomalyType === "sensor_dropout"
          ? 0
          : Math.round(temperature * 100) / 100,
        humidity: Math.round(Math.max(10, Math.min(100, humidity)) * 100) / 100,
        lightIntensity,
        soilPH: Math.round(pH * 100) / 100,
        rainfall: Math.round(rainfall * 10) / 10,
        batteryLevel: Math.round((95 - day * 0.3 + Math.random() * 5) * 10) / 10,
        anomaly,
        anomalyType,
      };
      
      data.push(sensorReading);
    }
  }
  
  return data;
}

/**
 * Generates a summary of sensor data for dashboard display.
 */
function generateSensorSummary(sensorData) {
  if (!sensorData || sensorData.length === 0) {
    return { error: "No sensor data available" };
  }
  
  const latest = sensorData[sensorData.length - 1];
  const moisture = sensorData.map(d => d.soilMoisture);
  const temp = sensorData.map(d => d.temperature);
  
  const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  
  return {
    latest,
    averages: {
      soilMoisture: Math.round(avg(moisture) * 100) / 100,
      temperature: Math.round(avg(temp) * 100) / 100,
      humidity: Math.round(avg(sensorData.map(d => d.humidity)) * 100) / 100,
    },
    ranges: {
      soilMoisture: { min: Math.min(...moisture), max: Math.max(...moisture) },
      temperature: { min: Math.min(...temp), max: Math.max(...temp) },
    },
    totalReadings: sensorData.length,
    anomalyCount: sensorData.filter(d => d.anomaly).length,
    daysOfData: Math.ceil(sensorData.length / 4),
  };
}

module.exports = {
  generateSensorData,
  generateSensorSummary,
};
