/**
 * ML Prediction Service
 * 
 * Implements predictive irrigation modeling using:
 * 1. Linear Regression — Trend analysis on historical water usage
 * 2. Exponential Moving Average (EMA) — Smoothed short-term predictions
 * 3. Penman-Monteith Evapotranspiration (ET₀) — Scientific water need estimation
 * 4. Crop coefficient method — ETc = Kc × ET₀ (FAO standard)
 * 
 * These are real, academically recognized algorithms used in precision agriculture.
 */

const { CROP_DATABASE, getCurrentGrowthStage, SOIL_TYPES } = require("./cropDatabase");

/**
 * Simple Linear Regression
 * Fits y = mx + b to a dataset and returns slope (m), intercept (b), and R² score.
 * 
 * @param {number[]} x - Independent variable values
 * @param {number[]} y - Dependent variable values
 * @returns {{ slope: number, intercept: number, rSquared: number, predict: function }}
 */
function linearRegression(x, y) {
  const n = x.length;
  if (n < 2) return { slope: 0, intercept: y[0] || 0, rSquared: 0, predict: (val) => y[0] || 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumXX += x[i] * x[i];
    sumYY += y[i] * y[i];
  }

  const denominator = (n * sumXX - sumX * sumX);
  const slope = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;
  const intercept = (sumY - slope * sumX) / n;

  // R² (coefficient of determination) — how well the model fits
  const ssRes = y.reduce((sum, yi, i) => sum + Math.pow(yi - (slope * x[i] + intercept), 2), 0);
  const ssTot = y.reduce((sum, yi) => sum + Math.pow(yi - sumY / n, 2), 0);
  const rSquared = ssTot !== 0 ? 1 - ssRes / ssTot : 0;

  return {
    slope: Math.round(slope * 1000) / 1000,
    intercept: Math.round(intercept * 100) / 100,
    rSquared: Math.round(Math.max(0, rSquared) * 1000) / 1000,
    predict: (val) => Math.max(0, Math.round((slope * val + intercept) * 100) / 100),
  };
}

/**
 * Exponential Moving Average (EMA)
 * Gives more weight to recent data points, useful for short-term prediction.
 * 
 * @param {number[]} data - Time series data
 * @param {number} alpha - Smoothing factor (0.1 = slow, 0.5 = fast)
 * @returns {number[]} EMA values
 */
function exponentialMovingAverage(data, alpha = 0.3) {
  if (data.length === 0) return [];
  const ema = [data[0]];
  for (let i = 1; i < data.length; i++) {
    ema.push(alpha * data[i] + (1 - alpha) * ema[i - 1]);
  }
  return ema.map(v => Math.round(v * 100) / 100);
}

/**
 * Simplified Penman-Monteith Evapotranspiration Estimation (ET₀)
 * 
 * Full Penman-Monteith equation:
 * ET₀ = [0.408 × Δ × (Rn - G) + γ × (900 / (T+273)) × u₂ × (es - ea)] / [Δ + γ × (1 + 0.34 × u₂)]
 * 
 * Where:
 * - Δ = slope of saturation vapor pressure curve
 * - Rn = net radiation
 * - G = soil heat flux
 * - γ = psychrometric constant
 * - T = mean temperature
 * - u₂ = wind speed at 2m
 * - es = saturation vapor pressure
 * - ea = actual vapor pressure
 * 
 * Simplified implementation using available weather data.
 * 
 * @param {number} tempMax - Maximum temperature (°C)
 * @param {number} tempMin - Minimum temperature (°C)
 * @param {number} humidity - Relative humidity (%)
 * @param {number} windSpeed - Wind speed at 2m height (m/s)
 * @param {number} solarRadiation - Solar radiation (MJ/m²/day), estimated if not provided
 * @param {number} latitude - Latitude in degrees (for solar radiation estimation)
 * @returns {number} ET₀ in mm/day
 */
function penmanMonteithET0(tempMax, tempMin, humidity = 60, windSpeed = 2, solarRadiation = null, latitude = 20) {
  const tempMean = (tempMax + tempMin) / 2;
  
  // Saturation vapor pressure (es) using Tetens formula
  const es_max = 0.6108 * Math.exp((17.27 * tempMax) / (tempMax + 237.3));
  const es_min = 0.6108 * Math.exp((17.27 * tempMin) / (tempMin + 237.3));
  const es = (es_max + es_min) / 2;
  
  // Actual vapor pressure (ea) from humidity
  const ea = es * (humidity / 100);
  
  // Vapor pressure deficit
  const vpd = es - ea;
  
  // Slope of saturation vapor pressure curve (Δ)
  const delta = (4098 * (0.6108 * Math.exp((17.27 * tempMean) / (tempMean + 237.3)))) / Math.pow(tempMean + 237.3, 2);
  
  // Psychrometric constant (γ) — assumes standard atmospheric pressure at sea level
  const pressure = 101.3; // kPa
  const gamma = 0.665e-3 * pressure;
  
  // Estimate solar radiation if not provided (using Hargreaves radiation formula)
  if (!solarRadiation) {
    // Extraterrestrial radiation approximation based on latitude and season
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const dr = 1 + 0.033 * Math.cos(2 * Math.PI * dayOfYear / 365);
    const solarDeclination = 0.409 * Math.sin(2 * Math.PI * dayOfYear / 365 - 1.39);
    const latRad = latitude * Math.PI / 180;
    const ws = Math.acos(-Math.tan(latRad) * Math.tan(solarDeclination));
    const Ra = (24 * 60 / Math.PI) * 0.0820 * dr * (ws * Math.sin(latRad) * Math.sin(solarDeclination) + Math.cos(latRad) * Math.cos(solarDeclination) * Math.sin(ws));
    
    // Hargreaves radiation estimate
    const kRs = 0.16; // Adjustment coefficient (inland)
    solarRadiation = kRs * Math.sqrt(Math.max(1, tempMax - tempMin)) * Ra;
  }
  
  // Net radiation estimation
  const albedo = 0.23; // Reference crop albedo
  const Rns = (1 - albedo) * solarRadiation;
  
  // Net longwave radiation (simplified)
  const sigma = 4.903e-9; // Stefan-Boltzmann constant (MJ/m²/K⁴/day)
  const Rnl = sigma * ((Math.pow(tempMax + 273.16, 4) + Math.pow(tempMin + 273.16, 4)) / 2) * 
              (0.34 - 0.14 * Math.sqrt(ea)) * (1.35 * (solarRadiation / (0.75 * 40)) - 0.35);
  
  const Rn = Math.max(0, Rns - Math.abs(Rnl));
  const G = 0; // Soil heat flux ≈ 0 for daily calculations
  
  // Penman-Monteith equation
  const numerator = 0.408 * delta * (Rn - G) + gamma * (900 / (tempMean + 273)) * windSpeed * vpd;
  const denominator = delta + gamma * (1 + 0.34 * windSpeed);
  
  const ET0 = Math.max(0.5, numerator / denominator);
  
  return Math.round(ET0 * 100) / 100;
}

/**
 * Predicts water needs for the next 7 days based on:
 * - Historical water usage data (linear regression trend)
 * - Crop growth stage and Kc coefficient
 * - Weather forecast (temperature, rain, humidity)
 * - Soil type adjustment
 * 
 * @param {object} params
 * @param {string} params.cropType - Crop identifier
 * @param {Array} params.historicalUsage - Array of { date, litersUsed }
 * @param {object} params.weatherForecast - Weather forecast data
 * @param {string} params.soilType - Soil type identifier
 * @param {number} params.areaHectares - Field area
 * @param {Date} params.plantingDate - When crop was planted
 * @returns {object} 7-day prediction with daily recommendations
 */
function predictWaterNeeds({ cropType = "wheat", historicalUsage = [], weatherForecast = null, soilType = "loam", areaHectares = 1, plantingDate = null }) {
  const crop = CROP_DATABASE[cropType.toLowerCase()] || CROP_DATABASE.wheat;
  const soil = SOIL_TYPES[soilType] || SOIL_TYPES.loam;
  
  // Get current growth stage
  const growthStage = plantingDate ? getCurrentGrowthStage(cropType, plantingDate) : null;
  const kc = growthStage ? growthStage.kc : crop.stages.mid.kc;
  
  // Analyze historical usage trend if data available
  let trendAnalysis = null;
  if (historicalUsage.length >= 3) {
    const x = historicalUsage.map((_, i) => i);
    const y = historicalUsage.map(h => h.litersUsed || h);
    const regression = linearRegression(x, y);
    const ema = exponentialMovingAverage(y);
    
    trendAnalysis = {
      trend: regression.slope > 0.5 ? "increasing" : regression.slope < -0.5 ? "decreasing" : "stable",
      slope: regression.slope,
      rSquared: regression.rSquared,
      lastEMA: ema[ema.length - 1],
      prediction: regression.predict(historicalUsage.length),
    };
  }
  
  // Generate 7-day predictions
  const predictions = [];
  const now = new Date();
  
  for (let day = 0; day < 7; day++) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + day);
    
    // Base ET₀ estimation from weather forecast or defaults
    let tempMax = 32, tempMin = 22, humidity = 60, windSpeed = 3, rainExpected = 0;
    
    if (weatherForecast && weatherForecast.forecast && weatherForecast.forecast[day]) {
      const fc = weatherForecast.forecast[day];
      tempMax = fc.tempMax || tempMax;
      tempMin = fc.tempMin || tempMin;
      humidity = fc.humidity || humidity;
      windSpeed = fc.windSpeed || windSpeed;
      rainExpected = fc.rainVolume || 0;
    } else {
      // Add some variation for demo
      tempMax += Math.sin(day * 0.5) * 3 + (Math.random() * 2 - 1);
      tempMin += Math.sin(day * 0.5) * 2 + (Math.random() * 2 - 1);
      humidity += Math.sin(day * 0.7) * 10;
      rainExpected = Math.random() > 0.7 ? Math.random() * 15 : 0;
    }
    
    // Calculate ET₀ using Penman-Monteith
    const et0 = penmanMonteithET0(tempMax, tempMin, humidity, windSpeed);
    
    // Crop water requirement: ETc = Kc × ET₀
    const etc = kc * et0;
    
    // Adjust for soil type
    const adjustedEtc = etc * soil.adjustmentFactor;
    
    // Account for rainfall (effective rainfall ≈ 80% of total)
    const effectiveRain = rainExpected * 0.8;
    const netIrrigationNeed = Math.max(0, adjustedEtc - effectiveRain);
    
    // Convert to liters for the field
    const litersNeeded = Math.round(netIrrigationNeed * 10000 * areaHectares);
    
    // Trend-adjusted prediction (blend scientific estimate with historical pattern)
    let finalPrediction = litersNeeded;
    if (trendAnalysis) {
      const historicalPrediction = trendAnalysis.prediction || litersNeeded;
      // Weighted average: 70% scientific, 30% historical pattern
      finalPrediction = Math.round(0.7 * litersNeeded + 0.3 * historicalPrediction);
    }
    
    const shouldIrrigate = netIrrigationNeed > 1.5 && rainExpected < 5;
    
    predictions.push({
      date: targetDate.toISOString().split("T")[0],
      dayName: targetDate.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: day + 1,
      et0: Math.round(et0 * 100) / 100,
      etc: Math.round(etc * 100) / 100,
      adjustedEtc: Math.round(adjustedEtc * 100) / 100,
      rainExpected: Math.round(rainExpected * 10) / 10,
      effectiveRain: Math.round(effectiveRain * 10) / 10,
      netIrrigationNeed: Math.round(netIrrigationNeed * 100) / 100,
      litersNeeded: finalPrediction,
      shouldIrrigate,
      confidence: trendAnalysis ? Math.round((0.5 + trendAnalysis.rSquared * 0.5) * 100) : 65,
      weather: { tempMax: Math.round(tempMax * 10) / 10, tempMin: Math.round(tempMin * 10) / 10, humidity: Math.round(humidity), windSpeed: Math.round(windSpeed * 10) / 10 },
    });
  }
  
  // Summary statistics
  const totalWaterNeeded = predictions.reduce((sum, p) => sum + p.litersNeeded, 0);
  const daysToIrrigate = predictions.filter(p => p.shouldIrrigate).length;
  const avgDailyNeed = Math.round(totalWaterNeeded / 7);
  
  // Estimated savings from smart scheduling vs. constant irrigation
  const baselineDaily = Math.round(crop.waterRequirement.max * 10000 * areaHectares);
  const baselineWeekly = baselineDaily * 7;
  const estimatedSavings = Math.max(0, baselineWeekly - totalWaterNeeded);
  const savingsPercent = baselineWeekly > 0 ? Math.round((estimatedSavings / baselineWeekly) * 100) : 0;
  
  return {
    crop: crop.name,
    soilType: soil.name,
    area: areaHectares,
    currentStage: growthStage ? growthStage.stage : "mid (assumed)",
    cropCoefficient: kc,
    predictions,
    summary: {
      totalWaterNeeded,
      avgDailyNeed,
      daysToIrrigate,
      daysToSkip: 7 - daysToIrrigate,
      estimatedSavings,
      savingsPercent,
      baselineWeekly,
    },
    trendAnalysis,
    algorithm: "Penman-Monteith ET₀ + FAO Crop Coefficient (Kc) + Linear Regression Trend",
  };
}

/**
 * Analyzes sensor data to detect patterns and generate insights.
 * @param {Array} sensorData - Array of { timestamp, soilMoisture, temperature, humidity }
 * @returns {object} Analysis results including trend, anomalies, and recommendations
 */
function analyzeSensorData(sensorData) {
  if (!sensorData || sensorData.length < 5) {
    return { error: "Insufficient data. Need at least 5 data points for analysis." };
  }
  
  const moistureData = sensorData.map(d => d.soilMoisture || 50);
  const tempData = sensorData.map(d => d.temperature || 25);
  
  // Statistical analysis
  const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  const stdDev = arr => {
    const m = mean(arr);
    return Math.sqrt(arr.reduce((sum, v) => sum + Math.pow(v - m, 2), 0) / arr.length);
  };
  
  const moistureMean = mean(moistureData);
  const moistureStd = stdDev(moistureData);
  const tempMean = mean(tempData);
  
  // Trend analysis
  const x = moistureData.map((_, i) => i);
  const moistureRegression = linearRegression(x, moistureData);
  const tempRegression = linearRegression(x, tempData);
  
  // Anomaly detection (Z-score method)
  const anomalies = moistureData
    .map((val, i) => ({ index: i, value: val, zScore: (val - moistureMean) / (moistureStd || 1) }))
    .filter(d => Math.abs(d.zScore) > 2)
    .map(d => ({
      index: d.index,
      value: d.value,
      type: d.zScore > 0 ? "spike" : "dip",
      severity: Math.abs(d.zScore) > 3 ? "critical" : "warning",
      timestamp: sensorData[d.index]?.timestamp,
    }));
  
  // EMA for smoothed predictions
  const ema = exponentialMovingAverage(moistureData, 0.3);
  const nextPrediction = ema.length > 0 ? ema[ema.length - 1] + moistureRegression.slope : moistureMean;
  
  return {
    statistics: {
      moisture: {
        mean: Math.round(moistureMean * 100) / 100,
        stdDev: Math.round(moistureStd * 100) / 100,
        min: Math.min(...moistureData),
        max: Math.max(...moistureData),
        current: moistureData[moistureData.length - 1],
      },
      temperature: {
        mean: Math.round(tempMean * 100) / 100,
        stdDev: Math.round(stdDev(tempData) * 100) / 100,
        min: Math.min(...tempData),
        max: Math.max(...tempData),
      },
    },
    trends: {
      moisture: {
        direction: moistureRegression.slope > 0.1 ? "increasing" : moistureRegression.slope < -0.1 ? "decreasing" : "stable",
        slope: moistureRegression.slope,
        rSquared: moistureRegression.rSquared,
      },
      temperature: {
        direction: tempRegression.slope > 0.05 ? "warming" : tempRegression.slope < -0.05 ? "cooling" : "stable",
        slope: tempRegression.slope,
      },
    },
    anomalies,
    anomalyCount: anomalies.length,
    smoothedData: ema,
    nextPrediction: Math.round(Math.max(0, Math.min(100, nextPrediction)) * 100) / 100,
    dataPoints: sensorData.length,
  };
}

module.exports = {
  linearRegression,
  exponentialMovingAverage,
  penmanMonteithET0,
  predictWaterNeeds,
  analyzeSensorData,
};
