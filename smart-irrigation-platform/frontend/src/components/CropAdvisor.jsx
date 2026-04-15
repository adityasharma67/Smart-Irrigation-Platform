import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BarChart, LineChart } from "./AnalyticsCharts";
import API_BASE from "../config/api";

/**
 * CropAdvisor — Interactive crop selection with detailed irrigation parameters,
 * growth stage visualization, and personalized water requirement calculators.
 */

const SOIL_OPTIONS = [
  { key: "sandy", label: "Sandy" },
  { key: "sandy-loam", label: "Sandy Loam" },
  { key: "loam", label: "Loam" },
  { key: "silt-loam", label: "Silt Loam" },
  { key: "clay-loam", label: "Clay Loam" },
  { key: "clay", label: "Clay" },
  { key: "black-soil", label: "Black Soil" },
];

const getCropBadge = (cropKey) => {
  if (!cropKey) return "CR";
  const label = String(cropKey).replace(/[^a-zA-Z]/g, "").toUpperCase();
  return label ? label.slice(0, 2) : "CR";
};

export default function CropAdvisor({ token, user }) {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [cropDetail, setCropDetail] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calcLoading, setCalcLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculator form
  const [calcForm, setCalcForm] = useState({
    soilType: "loam",
    areaHectares: "1",
    plantingDate: "",
  });

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/crops`);
      setCrops(res.data.crops || []);
    } catch (err) {
      setError("Failed to load crop database.");
    } finally {
      setLoading(false);
    }
  };

  const selectCrop = async (cropKey) => {
    setSelectedCrop(cropKey);
    setRecommendation(null);
    try {
      const res = await axios.get(`${API_BASE}/api/crops/${cropKey}`);
      setCropDetail(res.data);
    } catch (err) {
      setError("Failed to load crop details.");
    }
  };

  const calculateWater = async () => {
    if (!selectedCrop) return;
    setCalcLoading(true);
    try {
      const params = new URLSearchParams({
        soilType: calcForm.soilType,
        area: calcForm.areaHectares,
        ...(calcForm.plantingDate && { plantingDate: calcForm.plantingDate }),
      });
      const res = await axios.get(`${API_BASE}/api/crops/${selectedCrop}/recommendation?${params}`);
      setRecommendation(res.data);
    } catch (err) {
      setError("Failed to calculate water requirements.");
    } finally {
      setCalcLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-1">Crop Irrigation Advisor</h2>
        <p className="text-gray-500">
          Science-backed irrigation parameters for {crops.length}+ crops — 
          Based on <span className="font-semibold text-green-700">FAO Paper 56</span> standards
        </p>
      </motion.div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">⚠️ {error}</div>
      )}

      {/* Crop Selection Grid */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Select a Crop</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-3">
          {crops.map((crop, i) => (
            <motion.button
              key={crop.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => selectCrop(crop.key)}
              className={`p-3 rounded-2xl border-2 text-center transition-all hover:-translate-y-1 ${
                selectedCrop === crop.key
                  ? "border-green-500 bg-green-50 shadow-lg shadow-green-100"
                  : "border-gray-100 bg-white hover:border-green-200"
              }`}
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-black text-slate-700 flex items-center justify-center">
                {getCropBadge(crop.key)}
              </div>
              <div className="text-xs font-semibold text-gray-700 truncate">{crop.name?.split(" ")[0]}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Crop Detail Panel */}
      {cropDetail && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Crop Info Header */}
          <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 text-base font-black flex items-center justify-center three-d-float">
                {getCropBadge(selectedCrop)}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-extrabold">{cropDetail.name}</h3>
                <p className="text-green-100 text-sm italic">{cropDetail.scientificName}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">{cropDetail.category}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">{cropDetail.totalGrowingDays} days</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">Drought: {cropDetail.droughtTolerance}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">{cropDetail.irrigationMethod}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Growth Stages Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Growth Stages & Crop Coefficients (Kc)</h3>
              
              {/* Visual timeline */}
              <div className="relative mb-6">
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  {Object.entries(cropDetail.stages || {}).map(([name, stage], i) => {
                    const percent = (stage.days / cropDetail.totalGrowingDays) * 100;
                    const colors = ["bg-green-300", "bg-green-400", "bg-green-600", "bg-green-800"];
                    return (
                      <div key={name} className={`${colors[i]} h-full`} style={{ width: `${percent}%` }} title={`${name}: ${stage.days} days`} />
                    );
                  })}
                </div>
              </div>

              {Object.entries(cropDetail.stages || {}).map(([name, stage], i) => (
                <div key={name} className={`rounded-xl p-3 mb-2 border ${
                  cropDetail.criticalStages?.includes(name) ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800 capitalize text-sm">{name}</span>
                      {cropDetail.criticalStages?.includes(name) && (
                        <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">CRITICAL</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{stage.days} days</span>
                      <span className="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Kc = {stage.kc}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{stage.description}</p>
                </div>
              ))}

              {/* Kc Bar Chart */}
              <div className="mt-4">
                <BarChart
                  data={Object.values(cropDetail.stages || {}).map(s => s.kc)}
                  labels={Object.keys(cropDetail.stages || {}).map(n => n.charAt(0).toUpperCase() + n.slice(1))}
                  height={150}
                  colors={Object.keys(cropDetail.stages || {}).map(n => 
                    cropDetail.criticalStages?.includes(n) ? "#ef4444" : "#059669"
                  )}
                />
              </div>
            </div>

            {/* Water Calculator */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Water Requirement Calculator</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Soil Type</label>
                  <select
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-colors text-sm outline-none"
                    value={calcForm.soilType}
                    onChange={(e) => setCalcForm({ ...calcForm, soilType: e.target.value })}
                  >
                    {SOIL_OPTIONS.map(s => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Field Area (hectares)</label>
                  <input
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-colors text-sm outline-none"
                    type="number"
                    value={calcForm.areaHectares}
                    onChange={(e) => setCalcForm({ ...calcForm, areaHectares: e.target.value })}
                    min="0.1" step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Planting Date (optional)</label>
                  <input
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-colors text-sm outline-none"
                    type="date"
                    value={calcForm.plantingDate}
                    onChange={(e) => setCalcForm({ ...calcForm, plantingDate: e.target.value })}
                  />
                </div>

                <button
                  onClick={calculateWater}
                  disabled={calcLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3.5 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 shadow-md"
                >
                  {calcLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Calculating...
                    </span>
                  ) : "Calculate Water Needs →"}
                </button>
              </div>

              {/* Results */}
              {recommendation && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <h4 className="text-sm font-bold text-green-700 mb-3">💧 Water Requirement Results</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Daily Need", value: `${recommendation.dailyWaterNeed?.liters?.toLocaleString()} L`, sub: `${recommendation.dailyWaterNeed?.mm} mm/day` },
                        { label: "Weekly Need", value: `${recommendation.weeklyWaterNeed?.liters?.toLocaleString()} L`, sub: `${recommendation.weeklyWaterNeed?.mm} mm/week` },
                        { label: "Irrigation Interval", value: `Every ${recommendation.irrigationSchedule?.intervalDays} days`, sub: recommendation.irrigationSchedule?.method },
                        { label: "per Irrigation", value: `${recommendation.irrigationSchedule?.litersPerIrrigation?.toLocaleString()} L`, sub: `Kc = ${recommendation.cropCoefficient}` },
                      ].map((r, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 border border-green-100">
                          <div className="text-lg font-bold text-gray-800">{r.value}</div>
                          <div className="text-xs text-gray-400">{r.label}</div>
                          <div className="text-[10px] text-green-600 mt-0.5">{r.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Growth Stage Info */}
                  {recommendation.growthStage && recommendation.growthStage.stage !== "harvested" && (
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <h4 className="text-sm font-bold text-blue-700 mb-2">Current Growth Stage</h4>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700 capitalize">{recommendation.growthStage.stage}</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                          Day {recommendation.growthStage.dayInStage} • {recommendation.growthStage.progressPercent}% complete
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${recommendation.growthStage.progressPercent}%` }} />
                      </div>
                      {recommendation.isCriticalStage && (
                        <p className="text-xs text-red-600 font-semibold mt-2">⚠️ Critical stage — water stress now causes maximum yield loss!</p>
                      )}
                    </div>
                  )}

                  {/* Recommendation Text */}
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <h4 className="text-sm font-bold text-amber-700 mb-2">💡 Expert Recommendation</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{recommendation.recommendation}</p>
                  </div>

                  {/* Scientific Details */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Scientific Parameters</h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div><span className="text-gray-400">ET₀:</span> <span className="font-bold">{recommendation.referenceET} mm/day</span></div>
                      <div><span className="text-gray-400">ETc:</span> <span className="font-bold">{recommendation.cropET} mm/day</span></div>
                      <div><span className="text-gray-400">Adj. ETc:</span> <span className="font-bold">{recommendation.adjustedET} mm/day</span></div>
                      <div><span className="text-gray-400">Kc:</span> <span className="font-bold">{recommendation.cropCoefficient}</span></div>
                      <div><span className="text-gray-400">Soil Factor:</span> <span className="font-bold">{recommendation.soilAdjustmentFactor}</span></div>
                      <div><span className="text-gray-400">Moisture:</span> <span className="font-bold">{recommendation.optimalMoisture?.min}-{recommendation.optimalMoisture?.max}%</span></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Crop Details Info Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">🌡️ Optimal Conditions</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Temperature</span>
                  <span className="text-sm font-bold">{cropDetail.optimalTemperature?.min}°- {cropDetail.optimalTemperature?.max}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Soil Moisture</span>
                  <span className="text-sm font-bold">{cropDetail.optimalSoilMoisture?.min} - {cropDetail.optimalSoilMoisture?.max}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Root Depth</span>
                  <span className="text-sm font-bold">{cropDetail.rootDepth?.initial} - {cropDetail.rootDepth?.max}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Water (mm/day)</span>
                  <span className="text-sm font-bold">{cropDetail.waterRequirement?.min} - {cropDetail.waterRequirement?.max}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">🌍 Soil Compatibility</h4>
              <div className="flex flex-wrap gap-2">
                {cropDetail.soilPreference?.map((soil, i) => (
                  <span key={i} className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-100">
                    {soil}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">📝 Notes</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{cropDetail.notes}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* No selection placeholder */}
      {!selectedCrop && !loading && (
        <div className="bg-white p-16 rounded-2xl shadow-lg text-center border border-gray-100">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-xl three-d-float" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">Select a Crop Above</h3>
          <p className="text-gray-500">Choose from our database of {crops.length}+ crops to see detailed irrigation parameters and calculate water needs.</p>
        </div>
      )}
    </div>
  );
}
