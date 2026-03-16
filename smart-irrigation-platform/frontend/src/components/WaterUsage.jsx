import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import API_BASE from "../config/api";

// This image gives a nice background to our water usage cards
import wateringImg from "../assets/watering.jpg";

// Helper to determine the visual style based on how much water is being used
function getStatusColor(status) {
  switch (status) {
    case "Optimal": return "bg-green-100 text-green-700 border-green-200";
    case "High":    return "bg-red-100 text-red-700 border-red-200";
    case "Low":     return "bg-yellow-100 text-yellow-700 border-yellow-200";
    default:        return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

// Picking an appropriate emoji for the current water status
function getStatusIcon(status) {
  switch (status) {
    case "Optimal": return "✅";
    case "High":    return "⚠️";
    case "Low":     return "🔻";
    default:        return "ℹ️";
  }
}

// A placeholder card to show while we're fetching data from the server
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
      <div className="skeleton aspect-video rounded-xl mb-4" />
      <div className="skeleton h-5 w-2/3 mb-2" />
      <div className="skeleton h-4 w-1/2 mb-4" />
      <div className="flex justify-between">
        <div className="skeleton h-6 w-20 rounded-full" />
        <div className="skeleton h-6 w-12" />
      </div>
    </div>
  );
}

export default function WaterUsage({ token, user }) {
  const [waterUsage, setWaterUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ field: "", litersUsed: "", status: "Optimal" });
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState("");

  // Load the usage history as soon as the page opens
  useEffect(() => { fetchWaterUsage(); }, []);

  // Grabs all water usage entries from our backend database
  const fetchWaterUsage = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/water-usage`);
      setWaterUsage(res.data);
    } catch {
      setError("Failed to load water usage data.");
    } finally {
      setLoading(false);
    }
  };

  // Allows a user to remove a specific entry if they made a mistake
  const handleDeleteUsage = async (id) => {
    if (!window.confirm("Delete this water usage entry?")) return;
    try {
      await axios.delete(`${API_BASE}/api/water-usage/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove it from our local list immediately
      setWaterUsage((prev) => prev.filter((w) => String(w._id || w.id) !== String(id)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete entry.");
    }
  };

  // Saves a new water usage entry to the server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(
        `${API_BASE}/api/water-usage`,
        { field: form.field, litersUsed: parseFloat(form.litersUsed), status: form.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Clean up the form and show a success message
      setForm({ field: "", litersUsed: "", status: "Optimal" });
      setShowForm(false);
      setSuccess("Water usage entry added successfully!");
      setTimeout(() => setSuccess(""), 3000);
      // Refresh the list to show the new entry
      fetchWaterUsage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add water usage.");
    }
  };

  // We calculate these stats on the fly to show at the top of the page
  const totalLiters = waterUsage.reduce((s, w) => s + (parseFloat(w.litersUsed) || 0), 0);
  const optimalCount = waterUsage.filter((w) => w.status === "Optimal").length;
  const highCount = waterUsage.filter((w) => w.status === "High").length;
  const lowCount = waterUsage.filter((w) => w.status === "Low").length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        <div>
          <h2 className="text-4xl font-extrabold text-gray-800 mb-1">💧 Water Usage</h2>
          <p className="text-gray-500">Track and monitor irrigation water across all your fields.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:from-blue-700 hover:to-cyan-700 transition-all hover:-translate-y-0.5"
        >
          {showForm ? "✕ Cancel" : "+ Add Entry"}
        </button>
      </motion.div>

      {/* A quick summary of the water usage stats */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Liters", value: totalLiters.toLocaleString(), icon: "💧", color: "bg-blue-50 text-blue-700 border-blue-200" },
            { label: "Optimal Fields", value: optimalCount, icon: "✅", color: "bg-green-50 text-green-700 border-green-200" },
            { label: "High Usage", value: highCount, icon: "⚠️", color: "bg-red-50 text-red-700 border-red-200" },
            { label: "Low Usage", value: lowCount, icon: "🔻", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`${s.color} border rounded-xl p-4 text-center`}
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-extrabold text-xl">{s.value}</div>
              <div className="text-xs opacity-70 mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Feedback alerts for the user */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">⚠️ {error}</div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm"
        >
          ✅ {success}
        </motion.div>
      )}

      {/* The slide-down form to add a new tracking entry */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-blue-100"
        >
          <h3 className="text-xl font-bold text-blue-700 mb-5">💧 Add Water Usage Entry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Field Name *</label>
                <input
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors text-sm outline-none"
                  placeholder="e.g., North Wheat Field"
                  value={form.field}
                  onChange={(e) => setForm({ ...form, field: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Liters Used *</label>
                <input
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors text-sm outline-none"
                  type="number"
                  placeholder="e.g., 1500"
                  value={form.litersUsed}
                  onChange={(e) => setForm({ ...form, litersUsed: e.target.value })}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Status *</label>
                <select
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors text-sm outline-none"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Optimal">✅ Optimal</option>
                  <option value="High">⚠️ High</option>
                  <option value="Low">🔻 Low</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md"
            >
              Add Entry
            </button>
          </form>
        </motion.div>
      )}

      {/* The main grid showing all current fields and their water status */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : waterUsage.length === 0 ? (
        // What to show when there's no data yet
        <div className="bg-white p-16 rounded-2xl shadow-lg text-center border border-gray-100">
          <div className="text-7xl mb-4 float-anim inline-block">💧</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No Water Usage Data</h3>
          <p className="text-gray-500">Start tracking by adding your first field entry above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {waterUsage.map((usage, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
              key={usage._id || usage.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
            >
              {/* Visual header for the card with the field name and status */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={wateringImg}
                  alt={usage.field}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <h3 className="text-white font-bold text-lg leading-tight">{usage.field}</h3>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusColor(usage.status)}`}>
                    {getStatusIcon(usage.status)} {usage.status}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl font-extrabold text-blue-600">
                    {typeof usage.litersUsed === "number"
                      ? usage.litersUsed.toLocaleString()
                      : usage.litersUsed}
                  </span>
                  <span className="text-gray-400 text-sm font-medium">liters used</span>
                </div>

                {/* A visual progress bar representing the water level or usage status */}
                <div className="mb-4">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          usage.status === "Optimal" ? "60%" :
                          usage.status === "High" ? "90%" : "20%",
                      }}
                      transition={{ duration: 0.8, delay: idx * 0.05 }}
                      className={`h-full rounded-full ${
                        usage.status === "Optimal" ? "bg-green-500" :
                        usage.status === "High" ? "bg-red-500" : "bg-yellow-400"
                      }`}
                    />
                  </div>
                </div>

                {user && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDeleteUsage(usage._id || usage.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
