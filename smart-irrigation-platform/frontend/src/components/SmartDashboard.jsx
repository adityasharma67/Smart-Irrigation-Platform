import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { LineChart, BarChart, GaugeChart, MultiLineChart } from "./AnalyticsCharts";
import API_BASE from "../config/api";

/**
 * SmartDashboard — The intelligent analytics hub.
 * Displays weather, sensor data, predictions, efficiency, and smart schedules.
 */
export default function SmartDashboard({ token, user }) {
  const [weather, setWeather] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [efficiency, setEfficiency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const location = user?.location || "Delhi";

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError("");
    try {
      const [weatherRes, predRes, sensorRes, schedRes, effRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/api/weather/${encodeURIComponent(location)}/irrigation-impact`),
        axios.get(`${API_BASE}/api/predictions/wheat?location=${encodeURIComponent(location)}&area=2&soilType=loam`),
        axios.get(`${API_BASE}/api/analytics/sensor-data/field-north?cropType=wheat&days=30&soilType=loam`),
        axios.get(`${API_BASE}/api/schedule/demo?location=${encodeURIComponent(location)}&days=7`),
        axios.get(`${API_BASE}/api/analytics/efficiency/demo?actualUsage=5000&recommendedUsage=4500&rainfall=3`),
      ]);

      if (weatherRes.status === "fulfilled") setWeather(weatherRes.value.data);
      if (predRes.status === "fulfilled") setPredictions(predRes.value.data);
      if (sensorRes.status === "fulfilled") setSensorData(sensorRes.value.data);
      if (schedRes.status === "fulfilled") setSchedule(schedRes.value.data);
      if (effRes.status === "fulfilled") setEfficiency(effRes.value.data);
    } catch (err) {
      setError("Some data could not be loaded. Showing available information.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "sensors", label: "Sensor Data", icon: "📡" },
    { id: "predictions", label: "Predictions", icon: "🔮" },
    { id: "schedule", label: "Smart Schedule", icon: "📅" },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="theme-display text-4xl font-extrabold text-white mb-1">🧠 Smart Analytics Dashboard</h2>
        <p className="text-gray-500">
          AI-powered insights for <span className="font-semibold text-green-700">{location}</span> — 
          Predictive models, weather integration, and real-time sensor analytics.
        </p>
      </motion.div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl mb-4 text-sm"> {error}</div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-cyan-300 via-emerald-300 to-lime-300 text-slate-950 shadow-md shadow-cyan-200/20"
                : "bg-white/5 text-slate-300 border border-white/10 hover:border-cyan-300/30 hover:bg-white/10"
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ===== OVERVIEW TAB ===== */}
      {activeTab === "overview" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Top Row: Weather + Efficiency */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weather Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 theme-surface rounded-[2rem] p-6 text-white"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold opacity-90">Weather & Irrigation Impact</h3>
                  <p className="text-blue-100 text-sm">{location} • {weather?.source === "openweathermap" ? "Live Data" : "Simulated Data"}</p>
                </div>
                <span className="text-5xl">{weather?.current?.rainProbability > 50 ? "🌧️" : weather?.current?.temperature > 35 ? "☀️" : "⛅"}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white/15 rounded-xl p-3 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{weather?.current?.temperature || "--"}°C</div>
                  <div className="text-xs text-blue-100">Temperature</div>
                </div>
                <div className="bg-white/15 rounded-xl p-3 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{weather?.current?.humidity || "--"}%</div>
                  <div className="text-xs text-blue-100">Humidity</div>
                </div>
                <div className="bg-white/15 rounded-xl p-3 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{weather?.current?.windSpeed || "--"}</div>
                  <div className="text-xs text-blue-100">Wind (m/s)</div>
                </div>
                <div className="bg-white/15 rounded-xl p-3 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{weather?.current?.rainProbability || "--"}%</div>
                  <div className="text-xs text-blue-100">Rain Chance</div>
                </div>
              </div>

              {/* Irrigation Impact */}
              {weather?.irrigationImpact && (
                <div className={`rounded-xl p-3 ${
                  weather.irrigationImpact.urgency === "high" ? "bg-red-500/30" :
                  weather.irrigationImpact.urgency === "medium" ? "bg-yellow-500/30" :
                  weather.irrigationImpact.urgency === "low" ? "bg-blue-500/30" : "bg-green-500/30"
                }`}>
                  <p className="text-sm font-medium">{weather.irrigationImpact.recommendation}</p>
                  <p className="text-xs mt-1 opacity-80">
                    Water adjustment: {weather.irrigationImpact.adjustmentPercent > 0 ? "+" : ""}{weather.irrigationImpact.adjustmentPercent}% • 
                    ET₀: {weather.irrigationImpact.estimatedET0} mm/day •
                    Best time: {weather.irrigationImpact.bestIrrigationTime}
                  </p>
                </div>
              )}

              {/* Mini Forecast */}
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {weather?.forecast?.slice(0, 5).map((day, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-2 min-w-[80px] text-center backdrop-blur-sm">
                    <div className="text-xs font-semibold">{day.dayName}</div>
                    <div className="text-lg">{day.rainProbability > 60 ? "🌧️" : day.tempMax > 35 ? "☀️" : "⛅"}</div>
                    <div className="text-xs">{Math.round(day.tempMax)}° / {Math.round(day.tempMin)}°</div>
                    {day.rainVolume > 0 && <div className="text-xs text-blue-200">{day.rainVolume}mm</div>}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Efficiency Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="theme-card rounded-[2rem] p-6"
            >
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Water Efficiency</h3>
              <div className="flex justify-center mb-3">
                <GaugeChart
                  value={efficiency?.score || 78}
                  max={100}
                  size={180}
                  label={efficiency?.rating || "Good"}
                />
              </div>
              <div className={`text-center text-sm font-semibold px-3 py-1.5 rounded-full ${
                (efficiency?.score || 78) >= 80 ? "bg-green-100 text-green-700" :
                (efficiency?.score || 78) >= 50 ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }`}>
                {efficiency?.rating || "Good"} Efficiency
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">{efficiency?.recommendation || "Your irrigation practices show good water management."}</p>
            </motion.div>
          </div>

          {/* Prediction + Stats Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 7-Day Prediction Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="theme-card rounded-[2rem] p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">7-Day Water Prediction</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                  {predictions?.algorithm ? "ML Model" : "Estimated"}
                </span>
              </div>
              {predictions?.predictions && (
                <>
                  <BarChart
                    data={predictions.predictions.map(p => p.litersNeeded)}
                    labels={predictions.predictions.map(p => p.dayName)}
                    height={200}
                    colors={predictions.predictions.map(p => p.shouldIrrigate ? "#059669" : "#d1d5db")}
                  />
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="text-center bg-green-50 rounded-xl p-2">
                      <div className="text-lg font-bold text-green-700">{(predictions.summary?.totalWaterNeeded / 1000).toFixed(1)}k</div>
                      <div className="text-xs text-gray-500">Total (L)</div>
                    </div>
                    <div className="text-center bg-blue-50 rounded-xl p-2">
                      <div className="text-lg font-bold text-blue-700">{predictions.summary?.daysToIrrigate || 0}</div>
                      <div className="text-xs text-gray-500">Irrigation Days</div>
                    </div>
                    <div className="text-center bg-emerald-50 rounded-xl p-2">
                      <div className="text-lg font-bold text-emerald-700">{predictions.summary?.savingsPercent || 0}%</div>
                      <div className="text-xs text-gray-500">Water Saved</div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Sensor Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Soil Moisture Trend (30 Days)</h3>
              {sensorData?.data && (
                <>
                  <LineChart
                    data={sensorData.data.filter((_, i) => i % 4 === 0).map(d => d.soilMoisture)}
                    labels={sensorData.data.filter((_, i) => i % 4 === 0).map(d => {
                      const date = new Date(d.timestamp);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    })}
                    height={200}
                    ylabel="Moisture %"
                  />
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {[
                      { label: "Current", value: `${sensorData.summary?.latest?.soilMoisture?.toFixed(1)}%`, icon: "💧" },
                      { label: "Average", value: `${sensorData.summary?.averages?.soilMoisture?.toFixed(1)}%`, icon: "📊" },
                      { label: "Trend", value: sensorData.trends?.trend?.direction || "stable", icon: "📈" },
                      { label: "Anomalies", value: sensorData.anomalies?.count || 0, icon: "⚠️" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center bg-gray-50 rounded-lg p-2">
                        <div className="text-sm">{stat.icon}</div>
                        <div className="text-xs font-bold text-gray-700">{stat.value}</div>
                        <div className="text-[10px] text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Algorithm Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="theme-surface rounded-[2rem] p-6"
          >
            <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider mb-3">🧠 Algorithms Powering This Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Penman-Monteith ET₀", desc: "FAO-standard evapotranspiration calculation using temperature, humidity, wind, and solar radiation", icon: "🌡️" },
                { name: "Linear Regression + EMA", desc: "Trend prediction on historical water usage data with exponential moving average smoothing", icon: "📈" },
                { name: "Z-Score Anomaly Detection", desc: "Statistical outlier identification in sensor data to flag equipment issues or unusual conditions", icon: "🔍" },
              ].map((algo, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-green-100">
                  <div className="text-2xl mb-2">{algo.icon}</div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{algo.name}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{algo.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ===== SENSORS TAB ===== */}
      {activeTab === "sensors" && sensorData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Soil Moisture", value: `${sensorData.summary?.latest?.soilMoisture?.toFixed(1)}%`, color: "bg-blue-50 text-blue-700 border-blue-200", icon: "💧" },
              { label: "Temperature", value: `${sensorData.summary?.latest?.temperature?.toFixed(1)}°C`, color: "bg-orange-50 text-orange-700 border-orange-200", icon: "🌡️" },
              { label: "Humidity", value: `${sensorData.summary?.latest?.humidity?.toFixed(1)}%`, color: "bg-cyan-50 text-cyan-700 border-cyan-200", icon: "💨" },
              { label: "Light", value: `${(sensorData.summary?.latest?.lightIntensity / 1000)?.toFixed(1)}k lux`, color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: "☀️" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`${s.color} border rounded-xl p-4 text-center`}
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-extrabold text-xl">{s.value}</div>
                <div className="text-xs opacity-70">{s.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Soil Moisture Over Time</h3>
              <LineChart
                data={sensorData.data.filter((_, i) => i % 2 === 0).map(d => d.soilMoisture)}
                labels={sensorData.data.filter((_, i) => i % 2 === 0).map((d, i) => i % 8 === 0 ? new Date(d.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "")}
                height={280}
                color="#0ea5e9"
                areaColor="rgba(14,165,233,0.12)"
                ylabel="Moisture %"
              />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Temperature & Humidity</h3>
              <MultiLineChart
                datasets={[
                  sensorData.data.filter((_, i) => i % 2 === 0).map(d => d.temperature),
                  sensorData.data.filter((_, i) => i % 2 === 0).map(d => d.humidity),
                ]}
                labels={sensorData.data.filter((_, i) => i % 2 === 0).map((d, i) => i % 8 === 0 ? new Date(d.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "")}
                legend={["Temperature (°C)", "Humidity (%)"]}
                height={280}
              />
            </div>
          </div>

          {/* Statistics */}
          {sensorData.statistics && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">📊 Statistical Analysis — Soil Moisture</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: "Mean", value: sensorData.statistics.mean },
                  { label: "Median", value: sensorData.statistics.median },
                  { label: "Std Dev", value: sensorData.statistics.stdDev },
                  { label: "Skewness", value: sensorData.statistics.skewness },
                  { label: "CV (%)", value: sensorData.statistics.cv },
                  { label: "Min", value: sensorData.statistics.min },
                  { label: "Max", value: sensorData.statistics.max },
                  { label: "P25", value: sensorData.statistics.percentiles?.p25 },
                  { label: "P75", value: sensorData.statistics.percentiles?.p75 },
                  { label: "IQR", value: sensorData.statistics.iqr },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-gray-800">{typeof s.value === "number" ? s.value.toFixed(2) : s.value}</div>
                    <div className="text-xs text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Anomalies */}
          {sensorData.anomalies?.count > 0 && (
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-3">⚠️ Anomalies Detected ({sensorData.anomalies.count})</h3>
              <div className="space-y-2">
                {sensorData.anomalies.details.slice(0, 5).map((a, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 flex justify-between items-center border border-red-100">
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.severity === "critical" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {a.severity}
                      </span>
                      <span className="text-sm text-gray-600 ml-2">{a.type === "high_spike" ? "Unusual spike" : "Unusual dip"} — Z-score: {a.zScore}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">Value: {a.value?.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ===== PREDICTIONS TAB ===== */}
      {activeTab === "predictions" && predictions && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-gray-800">🔮 7-Day Water Requirement Forecast</h3>
              <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                Crop: {predictions.crop} • Kc: {predictions.cropCoefficient}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">Algorithm: {predictions.algorithm}</p>

            <BarChart
              data={predictions.predictions.map(p => p.litersNeeded)}
              labels={predictions.predictions.map(p => `${p.dayName}\n${p.date?.slice(5)}`)}
              height={250}
              colors={predictions.predictions.map(p => p.shouldIrrigate ? "#059669" : "#d1d5db")}
            />
          </div>

          {/* Daily breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {predictions.predictions.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl p-4 border ${p.shouldIrrigate ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800">{p.dayName}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.shouldIrrigate ? "bg-green-200 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                    {p.shouldIrrigate ? "Irrigate" : "Skip"}
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-gray-800 mb-1">{(p.litersNeeded / 1000).toFixed(1)}k L</div>
                <div className="space-y-1 text-xs text-gray-500">
                  <div>ET₀: {p.et0} mm/day • Crop ET: {p.etc} mm/day</div>
                  <div>Rain: {p.rainExpected}mm • Temp: {p.weather?.tempMax?.toFixed(0)}°/{p.weather?.tempMin?.toFixed(0)}°</div>
                  <div>Confidence: {p.confidence}%</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4">📊 Weekly Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Water Needed", value: `${(predictions.summary?.totalWaterNeeded / 1000).toFixed(1)}k L` },
                { label: "Daily Average", value: `${(predictions.summary?.avgDailyNeed / 1000).toFixed(1)}k L` },
                { label: "Days to Irrigate", value: `${predictions.summary?.daysToIrrigate} of 7` },
                { label: "Estimated Savings", value: `${predictions.summary?.savingsPercent}%` },
              ].map((s, i) => (
                <div key={i} className="bg-white/15 rounded-xl p-3 backdrop-blur-sm text-center">
                  <div className="text-xl font-bold">{s.value}</div>
                  <div className="text-xs text-green-100">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Analysis */}
          {predictions.trendAnalysis && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">📈 Historical Trend Analysis</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-gray-800 capitalize">{predictions.trendAnalysis.trend}</div>
                  <div className="text-xs text-gray-400">Trend Direction</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-gray-800">{predictions.trendAnalysis.slope}</div>
                  <div className="text-xs text-gray-400">Slope (L/day)</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-gray-800">{predictions.trendAnalysis.rSquared}</div>
                  <div className="text-xs text-gray-400">R² Score</div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ===== SCHEDULE TAB ===== */}
      {activeTab === "schedule" && schedule && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Schedule Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Scheduled", value: `${(schedule.summary?.totalWaterScheduled / 1000).toFixed(0)}k L`, icon: "💧", color: "bg-blue-50 text-blue-700 border-blue-200" },
              { label: "Water Saved", value: `${(schedule.summary?.totalWaterSaved / 1000).toFixed(0)}k L`, icon: "💰", color: "bg-green-50 text-green-700 border-green-200" },
              { label: "Savings", value: `${schedule.summary?.savingsPercent}%`, icon: "📉", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
              { label: "Irrigation Days", value: `${schedule.summary?.irrigationDays} / ${schedule.daysScheduled}`, icon: "📅", color: "bg-purple-50 text-purple-700 border-purple-200" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`${s.color} border rounded-xl p-4 text-center`}
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-extrabold text-xl">{s.value}</div>
                <div className="text-xs opacity-70">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Daily Schedule */}
          {schedule.schedule?.map((day, di) => (
            <motion.div
              key={di}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: di * 0.05 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className={`p-4 flex justify-between items-center ${day.weather.rainExpected ? "bg-blue-50" : "bg-gray-50"}`}>
                <div>
                  <h3 className="font-bold text-gray-800">{day.dayName} — {day.date}</h3>
                  <p className="text-xs text-gray-500">
                    {Math.round(day.weather.tempMax)}°/{Math.round(day.weather.tempMin)}° • Wind: {day.weather.windSpeed}m/s • 
                    Rain: {day.weather.rainProbability}% {day.weather.rainExpected ? "Rain expected" : "No rain"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-700">{(day.totalLitersForDay / 1000).toFixed(1)}k L</div>
                  <div className="text-xs text-gray-400">{day.fieldsToIrrigate} fields</div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {day.fields.map((field, fi) => (
                  <div key={fi} className={`rounded-xl p-3 flex justify-between items-center border ${
                    field.shouldIrrigate ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100"
                  }`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-800">{field.fieldName}</span>
                        {field.isCriticalStage && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">CRITICAL</span>}
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          field.priorityLabel === "Critical" ? "bg-red-100 text-red-700" :
                          field.priorityLabel === "High" ? "bg-orange-100 text-orange-700" :
                          field.priorityLabel === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
                        }`}>{field.priorityLabel}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {field.crop} • Stage: {field.currentStage} • Moisture: {field.soilMoisture}% • ET: {field.cropET}mm/day
                      </div>
                    </div>
                    <div className="text-right">
                      {field.shouldIrrigate ? (
                        <>
                          <div className="text-sm font-bold text-green-700">{(field.litersNeeded / 1000).toFixed(1)}k L</div>
                          <div className="text-[10px] text-gray-400">{field.optimalTime?.start}-{field.optimalTime?.end} • {field.durationMinutes}min</div>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          {field.status === "skipped_rain" ? "Rain expected" : "Moisture OK"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Algorithm credit */}
          <div className="text-center text-xs text-gray-400 py-2">
            Schedule generated using: {schedule.algorithm}
          </div>
        </motion.div>
      )}
    </div>
  );
}
