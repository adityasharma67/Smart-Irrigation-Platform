/**
 * Analytics Service
 * 
 * Provides advanced statistical analysis on irrigation and sensor data:
 * - Descriptive statistics (mean, median, std dev, percentiles)
 * - Trend detection using linear regression
 * - Anomaly detection using Z-score method
 * - Water efficiency scoring
 * - Comparative analysis and savings calculation
 */

const { linearRegression } = require("./prediction");

/**
 * Calculates comprehensive descriptive statistics for a dataset.
 * 
 * @param {number[]} data - Numeric array
 * @returns {object} Full statistical summary
 */
function descriptiveStatistics(data) {
  if (!data || data.length === 0) return null;
  
  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  
  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  
  // Median
  const median = n % 2 === 0
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
    : sorted[Math.floor(n / 2)];
  
  // Variance and Standard Deviation
  const variance = sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  
  // Percentiles
  const percentile = (p) => {
    const idx = (p / 100) * (n - 1);
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    if (lower === upper) return sorted[lower];
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
  };
  
  // Skewness (measure of asymmetry)
  const skewness = stdDev !== 0
    ? (sorted.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0)) / n
    : 0;
  
  // Kurtosis (measure of tail heaviness)
  const kurtosis = stdDev !== 0
    ? (sorted.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 4), 0)) / n - 3
    : 0;
  
  // Coefficient of Variation
  const cv = mean !== 0 ? (stdDev / Math.abs(mean)) * 100 : 0;
  
  return {
    count: n,
    mean: round(mean),
    median: round(median),
    mode: findMode(sorted),
    min: sorted[0],
    max: sorted[n - 1],
    range: round(sorted[n - 1] - sorted[0]),
    sum: round(sum),
    variance: round(variance),
    stdDev: round(stdDev),
    cv: round(cv),
    skewness: round(skewness),
    kurtosis: round(kurtosis),
    percentiles: {
      p10: round(percentile(10)),
      p25: round(percentile(25)),
      p50: round(percentile(50)),
      p75: round(percentile(75)),
      p90: round(percentile(90)),
    },
    iqr: round(percentile(75) - percentile(25)),
  };
}

/**
 * Find the mode (most frequent value) in a sorted array.
 */
function findMode(sorted) {
  let maxCount = 0, mode = sorted[0], currentCount = 0, currentVal = null;
  for (const val of sorted) {
    if (val === currentVal) {
      currentCount++;
    } else {
      currentVal = val;
      currentCount = 1;
    }
    if (currentCount > maxCount) {
      maxCount = currentCount;
      mode = currentVal;
    }
  }
  return maxCount > 1 ? round(mode) : null; // null if no repeats
}

function round(val) {
  return Math.round(val * 100) / 100;
}

/**
 * Detects anomalies in time-series data using Z-score method.
 * Points with |Z-score| > threshold are flagged as anomalies.
 * 
 * @param {number[]} data - Time series values
 * @param {number} threshold - Z-score threshold (default: 2.0)
 * @returns {Array} Detected anomalies with indices and severity
 */
function detectAnomalies(data, threshold = 2.0) {
  if (!data || data.length < 5) return [];
  
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const stdDev = Math.sqrt(data.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / data.length);
  
  if (stdDev === 0) return [];
  
  return data
    .map((value, index) => {
      const zScore = (value - mean) / stdDev;
      return { index, value, zScore: round(zScore) };
    })
    .filter(d => Math.abs(d.zScore) > threshold)
    .map(d => ({
      ...d,
      type: d.zScore > 0 ? "high_spike" : "low_dip",
      severity: Math.abs(d.zScore) > 3 ? "critical" : Math.abs(d.zScore) > 2.5 ? "high" : "moderate",
      deviation: round(Math.abs(d.value - mean)),
    }));
}

/**
 * Analyzes trends in time-series data using multiple methods.
 * 
 * @param {Array} timeSeries - Array of { timestamp, value }
 * @returns {object} Trend analysis results
 */
function analyzeTrends(timeSeries) {
  if (!timeSeries || timeSeries.length < 3) {
    return { error: "Need at least 3 data points for trend analysis" };
  }
  
  const values = timeSeries.map(d => d.value || d);
  const x = values.map((_, i) => i);
  
  // Linear regression
  const regression = linearRegression(x, values);
  
  // Moving averages (7-point and 14-point)
  const movingAvg7 = calculateMovingAverage(values, 7);
  const movingAvg14 = calculateMovingAverage(values, 14);
  
  // Rate of change
  const rateOfChange = values.length > 1
    ? values.map((v, i) => i === 0 ? 0 : round(v - values[i - 1]))
    : [0];
  
  // Determine trend direction and strength
  let trendDirection, trendStrength;
  if (Math.abs(regression.slope) < 0.01) {
    trendDirection = "stable";
    trendStrength = "none";
  } else if (regression.rSquared > 0.7) {
    trendDirection = regression.slope > 0 ? "strong_increase" : "strong_decrease";
    trendStrength = "strong";
  } else if (regression.rSquared > 0.3) {
    trendDirection = regression.slope > 0 ? "moderate_increase" : "moderate_decrease";
    trendStrength = "moderate";
  } else {
    trendDirection = regression.slope > 0 ? "weak_increase" : "weak_decrease";
    trendStrength = "weak";
  }
  
  // Forecast next 7 values
  const forecast = Array.from({ length: 7 }, (_, i) => ({
    index: values.length + i,
    predicted: regression.predict(values.length + i),
  }));
  
  return {
    regression: {
      slope: regression.slope,
      intercept: regression.intercept,
      rSquared: regression.rSquared,
      equation: `y = ${regression.slope}x + ${regression.intercept}`,
    },
    trend: {
      direction: trendDirection,
      strength: trendStrength,
    },
    movingAverages: {
      ma7: movingAvg7,
      ma14: movingAvg14,
    },
    rateOfChange: {
      values: rateOfChange,
      average: round(rateOfChange.reduce((a, b) => a + b, 0) / rateOfChange.length),
      max: Math.max(...rateOfChange),
      min: Math.min(...rateOfChange),
    },
    forecast,
    dataPoints: values.length,
  };
}

/**
 * Calculates simple moving average.
 */
function calculateMovingAverage(data, window) {
  if (data.length < window) return data.map(v => round(v));
  return data.map((_, i) => {
    if (i < window - 1) return null;
    const windowSlice = data.slice(i - window + 1, i + 1);
    return round(windowSlice.reduce((a, b) => a + b, 0) / window);
  }).filter(v => v !== null);
}

/**
 * Calculates water usage efficiency score based on actual vs. recommended usage.
 * 
 * Score interpretation:
 * - 90-100: Excellent — minimal waste
 * - 70-89: Good — some optimization possible
 * - 50-69: Fair — significant room for improvement
 * - <50: Poor — excessive water usage detected
 * 
 * @param {number} actualUsage - Actual water used (liters)
 * @param {number} recommendedUsage - Recommended water amount (liters)
 * @param {number} rainfallReceived - Natural rainfall received (mm)
 * @param {number} fieldAreaHa - Field area in hectares
 * @returns {object} Efficiency analysis
 */
function calculateEfficiency(actualUsage, recommendedUsage, rainfallReceived = 0, fieldAreaHa = 1) {
  const rainfallLiters = rainfallReceived * 10000 * fieldAreaHa * 0.8; // 80% effective rainfall
  const adjustedRecommended = Math.max(0, recommendedUsage - rainfallLiters);
  
  let efficiencyScore;
  if (adjustedRecommended === 0) {
    efficiencyScore = actualUsage === 0 ? 100 : Math.max(0, 100 - (actualUsage / 1000));
  } else {
    const ratio = actualUsage / adjustedRecommended;
    if (ratio <= 1.05) {
      efficiencyScore = Math.min(100, 85 + (1.05 - ratio) * 300);
    } else if (ratio <= 1.2) {
      efficiencyScore = 85 - (ratio - 1.05) * 200;
    } else if (ratio <= 1.5) {
      efficiencyScore = 55 - (ratio - 1.2) * 100;
    } else {
      efficiencyScore = Math.max(0, 25 - (ratio - 1.5) * 50);
    }
  }
  
  efficiencyScore = Math.round(Math.max(0, Math.min(100, efficiencyScore)));
  
  const waste = Math.max(0, actualUsage - adjustedRecommended);
  const savings = Math.max(0, adjustedRecommended - actualUsage);
  
  let rating, recommendation;
  if (efficiencyScore >= 90) {
    rating = "Excellent";
    recommendation = "Your irrigation practices are highly efficient. Continue maintaining current schedule.";
  } else if (efficiencyScore >= 70) {
    rating = "Good";
    recommendation = "Good efficiency with minor optimization possible. Consider fine-tuning irrigation timing based on weather forecasts.";
  } else if (efficiencyScore >= 50) {
    rating = "Fair";
    recommendation = "Significant room for improvement. Install soil moisture sensors and adjust irrigation based on actual field conditions rather than fixed schedules.";
  } else {
    rating = "Poor";
    recommendation = "Excessive water usage detected. Implement drip irrigation, use weather-based scheduling, and check for system leaks immediately.";
  }
  
  return {
    score: efficiencyScore,
    rating,
    actualUsage: round(actualUsage),
    recommendedUsage: round(recommendedUsage),
    adjustedRecommended: round(adjustedRecommended),
    rainfallContribution: round(rainfallLiters),
    waste: round(waste),
    savings: round(savings),
    wastePercent: adjustedRecommended > 0 ? round((waste / adjustedRecommended) * 100) : 0,
    recommendation,
  };
}

/**
 * Generates a comprehensive water savings report.
 * Compares traditional vs. smart irrigation approaches.
 */
function generateSavingsReport(waterUsageHistory, cropType = "wheat", fieldAreaHa = 1) {
  if (!waterUsageHistory || waterUsageHistory.length === 0) {
    return { error: "No usage history provided" };
  }
  
  const usageValues = waterUsageHistory.map(w => w.litersUsed || w);
  const stats = descriptiveStatistics(usageValues);
  
  // Traditional irrigation baseline (constant maximum rate)
  const { CROP_DATABASE } = require("./cropDatabase");
  const crop = CROP_DATABASE[cropType.toLowerCase()] || CROP_DATABASE.wheat;
  const traditionalDaily = crop.waterRequirement.max * 10000 * fieldAreaHa;
  const traditionalTotal = traditionalDaily * usageValues.length;
  
  const actualTotal = stats.sum;
  const savings = Math.max(0, traditionalTotal - actualTotal);
  const savingsPercent = traditionalTotal > 0 ? round((savings / traditionalTotal) * 100) : 0;
  
  // Project annual savings
  const daysOfData = usageValues.length;
  const dailyAvgSavings = daysOfData > 0 ? savings / daysOfData : 0;
  const annualSavings = round(dailyAvgSavings * 365);
  
  // Cost estimation (approximate: ₹0.5 per liter for pumping + delivery)
  const costPerLiter = 0.0005; // ₹0.5 per 1000 liters
  const annualCostSavings = round(annualSavings * costPerLiter);
  
  return {
    period: {
      days: daysOfData,
      startDate: waterUsageHistory[0]?.date,
      endDate: waterUsageHistory[waterUsageHistory.length - 1]?.date,
    },
    traditional: {
      dailyUsage: round(traditionalDaily),
      totalUsage: round(traditionalTotal),
    },
    smart: {
      dailyAverage: stats.mean,
      totalUsage: stats.sum,
    },
    savings: {
      totalLiters: round(savings),
      percent: savingsPercent,
      annualProjection: annualSavings,
      annualCostSavings,
    },
    usageStatistics: stats,
    trend: analyzeTrends(usageValues),
    anomalies: detectAnomalies(usageValues),
  };
}

module.exports = {
  descriptiveStatistics,
  detectAnomalies,
  analyzeTrends,
  calculateMovingAverage,
  calculateEfficiency,
  generateSavingsReport,
};
