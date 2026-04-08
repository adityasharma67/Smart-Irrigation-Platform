/**
 * Weather Service
 * 
 * Integrates with OpenWeatherMap API to fetch real-time weather data
 * and 5-day forecasts. Uses caching to minimize API calls.
 * Falls back to realistic mock data when no API key is available.
 * 
 * Weather data is critical for smart irrigation because:
 * - Rain forecast can skip unnecessary irrigation (water savings)
 * - High temperatures increase evapotranspiration (need more water)
 * - Wind speed affects sprinkler efficiency
 * - Humidity influences plant transpiration rate
 */

const axios = require("axios");

const API_KEY = process.env.OPENWEATHER_API_KEY || "";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Simple in-memory cache with TTL (Time To Live)
const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Generates realistic mock weather data for demo/development
 */
function generateMockWeather(location) {
  const now = new Date();
  const hour = now.getHours();
  
  // Simulate diurnal temperature variation
  const baseTemp = 28 + Math.sin((hour - 6) * Math.PI / 12) * 8;
  const temp = Math.round((baseTemp + (Math.random() * 4 - 2)) * 10) / 10;
  
  return {
    location: location || "Demo City",
    current: {
      temperature: temp,
      feelsLike: temp + 2,
      humidity: Math.round(55 + Math.random() * 30),
      pressure: Math.round(1010 + Math.random() * 10),
      windSpeed: Math.round((5 + Math.random() * 15) * 10) / 10,
      windDirection: Math.round(Math.random() * 360),
      clouds: Math.round(Math.random() * 100),
      visibility: 10000,
      description: ["Clear sky", "Few clouds", "Scattered clouds", "Partly cloudy", "Light rain"][Math.floor(Math.random() * 5)],
      icon: "02d",
      uvIndex: Math.round((5 + Math.random() * 7) * 10) / 10,
      rainProbability: Math.round(Math.random() * 40),
    },
    forecast: Array.from({ length: 5 }, (_, i) => {
      const day = new Date(now);
      day.setDate(day.getDate() + i + 1);
      const dayTemp = 26 + Math.random() * 10;
      const rainChance = Math.round(Math.random() * 100);
      return {
        date: day.toISOString().split("T")[0],
        dayName: day.toLocaleDateString("en-US", { weekday: "short" }),
        tempMax: Math.round((dayTemp + 4) * 10) / 10,
        tempMin: Math.round((dayTemp - 4) * 10) / 10,
        humidity: Math.round(50 + Math.random() * 35),
        windSpeed: Math.round((3 + Math.random() * 12) * 10) / 10,
        rainProbability: rainChance,
        rainVolume: rainChance > 60 ? Math.round(Math.random() * 20 * 10) / 10 : 0,
        description: rainChance > 70 ? "Rain expected" : rainChance > 40 ? "Partly cloudy" : "Clear sky",
        icon: rainChance > 70 ? "10d" : rainChance > 40 ? "03d" : "01d",
      };
    }),
    source: "mock",
    timestamp: now.toISOString(),
  };
}

/**
 * Fetches current weather for a location.
 * @param {string} location - City name or "lat,lon"
 * @returns {object} Weather data
 */
async function getCurrentWeather(location) {
  if (!location) return generateMockWeather("Unknown");

  const cacheKey = `weather_${location}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // If no API key, return mock data
  if (!API_KEY) {
    const mock = generateMockWeather(location);
    setCache(cacheKey, mock);
    return mock;
  }

  try {
    // Determine if location is coordinates or city name
    const isCoords = /^-?\d+\.?\d*,-?\d+\.?\d*$/.test(location.replace(/\s/g, ""));
    let params = { appid: API_KEY, units: "metric" };
    
    if (isCoords) {
      const [lat, lon] = location.split(",").map(Number);
      params.lat = lat;
      params.lon = lon;
    } else {
      params.q = location;
    }

    // Fetch current weather
    const currentRes = await axios.get(`${BASE_URL}/weather`, { params, timeout: 5000 });
    
    // Fetch 5-day forecast
    const forecastRes = await axios.get(`${BASE_URL}/forecast`, { params, timeout: 5000 });

    const current = currentRes.data;
    const forecast = forecastRes.data;

    // Process forecast to daily summaries
    const dailyForecasts = {};
    forecast.list.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = { temps: [], humidity: [], wind: [], rain: 0, descriptions: [], icons: [] };
      }
      dailyForecasts[date].temps.push(item.main.temp);
      dailyForecasts[date].humidity.push(item.main.humidity);
      dailyForecasts[date].wind.push(item.wind.speed);
      dailyForecasts[date].rain += (item.rain?.["3h"] || 0);
      dailyForecasts[date].descriptions.push(item.weather[0].description);
      dailyForecasts[date].icons.push(item.weather[0].icon);
    });

    const forecastDays = Object.entries(dailyForecasts).slice(0, 5).map(([date, data]) => {
      const dayDate = new Date(date);
      return {
        date,
        dayName: dayDate.toLocaleDateString("en-US", { weekday: "short" }),
        tempMax: Math.round(Math.max(...data.temps) * 10) / 10,
        tempMin: Math.round(Math.min(...data.temps) * 10) / 10,
        humidity: Math.round(data.humidity.reduce((a, b) => a + b, 0) / data.humidity.length),
        windSpeed: Math.round((data.wind.reduce((a, b) => a + b, 0) / data.wind.length) * 10) / 10,
        rainProbability: data.rain > 0 ? Math.min(90, Math.round(data.rain * 10)) : 10,
        rainVolume: Math.round(data.rain * 10) / 10,
        description: data.descriptions[Math.floor(data.descriptions.length / 2)],
        icon: data.icons[Math.floor(data.icons.length / 2)],
      };
    });

    const result = {
      location: current.name || location,
      current: {
        temperature: current.main.temp,
        feelsLike: current.main.feels_like,
        humidity: current.main.humidity,
        pressure: current.main.pressure,
        windSpeed: current.wind.speed,
        windDirection: current.wind.deg,
        clouds: current.clouds.all,
        visibility: current.visibility,
        description: current.weather[0].description,
        icon: current.weather[0].icon,
        uvIndex: null,
        rainProbability: current.rain ? 80 : forecast.list[0]?.pop ? Math.round(forecast.list[0].pop * 100) : 10,
      },
      forecast: forecastDays,
      source: "openweathermap",
      timestamp: new Date().toISOString(),
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Weather API error:", error.message);
    // Fallback to mock on API error
    const mock = generateMockWeather(location);
    setCache(cacheKey, mock);
    return mock;
  }
}

/**
 * Calculates how weather conditions affect irrigation needs.
 * 
 * Uses a simplified Penman-Monteith approach:
 * - High temperature → more evaporation → more water needed
 * - Rain → less irrigation needed
 * - High wind → more evaporation from sprinklers
 * - High humidity → less transpiration
 * 
 * @param {object} weather - Weather data from getCurrentWeather
 * @returns {object} Irrigation impact analysis
 */
function calculateIrrigationImpact(weather) {
  const current = weather.current;
  
  // Temperature factor (reference: 25°C = 1.0)
  const tempFactor = 1 + (current.temperature - 25) * 0.04;
  
  // Humidity factor (reference: 60% = 1.0, lower humidity = more water needed)
  const humidityFactor = 1 + (60 - current.humidity) * 0.01;
  
  // Wind factor (reference: 5 km/h = 1.0)
  const windFactor = 1 + (current.windSpeed - 5) * 0.02;
  
  // Combined adjustment factor
  const adjustmentFactor = Math.max(0.3, Math.min(2.0, tempFactor * humidityFactor * windFactor));
  
  // Check if rain is expected in next 24-48 hours
  const nextDayForecast = weather.forecast[0];
  const skipIrrigation = nextDayForecast && (
    nextDayForecast.rainProbability > 60 && nextDayForecast.rainVolume > 5
  );
  
  // Calculate total expected rainfall in next 3 days
  const totalRainfall3Days = weather.forecast.slice(0, 3).reduce((sum, day) => sum + (day.rainVolume || 0), 0);
  
  // Estimated Reference Evapotranspiration (simplified Hargreaves equation)
  // ET0 = 0.0023 × (Tmean + 17.8) × (Tmax - Tmin)^0.5 × Ra
  // Simplified version using current data
  const tRange = nextDayForecast ? (nextDayForecast.tempMax - nextDayForecast.tempMin) : 10;
  const et0Estimate = 0.0023 * (current.temperature + 17.8) * Math.sqrt(Math.max(1, tRange)) * 15; // Ra ≈ 15 for tropical regions
  
  let recommendation;
  let urgency;
  
  if (skipIrrigation) {
    recommendation = `Rain is forecasted (${nextDayForecast.rainProbability}% chance, ~${nextDayForecast.rainVolume}mm). Consider skipping irrigation today to save water.`;
    urgency = "low";
  } else if (current.temperature > 38) {
    recommendation = "Very high temperature detected. Irrigate during early morning (5-7 AM) or late evening (6-8 PM) to minimize evaporation losses.";
    urgency = "high";
  } else if (current.humidity < 30) {
    recommendation = "Low humidity is increasing evapotranspiration. Increase irrigation volume by ~15-20%.";
    urgency = "medium";
  } else if (current.windSpeed > 15) {
    recommendation = "High winds detected. If using sprinkler irrigation, delay until wind subsides to reduce drift losses.";
    urgency = "medium";
  } else {
    recommendation = "Weather conditions are favorable for normal irrigation scheduling.";
    urgency = "normal";
  }

  return {
    adjustmentFactor: Math.round(adjustmentFactor * 100) / 100,
    adjustmentPercent: Math.round((adjustmentFactor - 1) * 100),
    skipIrrigation,
    estimatedET0: Math.round(et0Estimate * 100) / 100,
    totalRainfall3Days: Math.round(totalRainfall3Days * 10) / 10,
    recommendation,
    urgency,
    factors: {
      temperature: { value: current.temperature, factor: Math.round(tempFactor * 100) / 100, impact: tempFactor > 1.1 ? "increases water need" : tempFactor < 0.9 ? "reduces water need" : "neutral" },
      humidity: { value: current.humidity, factor: Math.round(humidityFactor * 100) / 100, impact: humidityFactor > 1.1 ? "increases water need" : humidityFactor < 0.9 ? "reduces water need" : "neutral" },
      wind: { value: current.windSpeed, factor: Math.round(windFactor * 100) / 100, impact: windFactor > 1.1 ? "increases evaporation" : "neutral" },
    },
    bestIrrigationTime: current.temperature > 30 ? "Early morning (5-7 AM)" : "Morning (7-9 AM)",
  };
}

module.exports = {
  getCurrentWeather,
  calculateIrrigationImpact,
};
