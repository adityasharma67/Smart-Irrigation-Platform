import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function WaterUsage({ token, user }) {
  const [waterUsage, setWaterUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    field: "",
    litersUsed: "",
    status: "Optimal",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchWaterUsage();
  }, []);

  const fetchWaterUsage = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/water-usage");
      setWaterUsage(res.data);
    } catch (err) {
      setError("Failed to load water usage data. Please try again later.");
      console.error("Error fetching water usage:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        "http://localhost:4000/api/water-usage",
        {
          field: form.field,
          litersUsed: parseFloat(form.litersUsed),
          status: form.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm({ field: "", litersUsed: "", status: "Optimal" });
      setShowForm(false);
      fetchWaterUsage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add water usage. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Optimal":
        return "bg-green-100 text-green-700";
      case "High":
        return "bg-red-100 text-red-700";
      case "Low":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading water usage data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-4xl font-bold text-green-700 mb-2">💧 Water Usage Management</h2>
          <p className="text-gray-600">Track and monitor water usage for your fields.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          {showForm ? "Cancel" : "+ Add Water Usage"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg mb-6"
        >
          <h3 className="text-xl font-semibold text-green-700 mb-4">Add New Water Usage</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Field Name *</label>
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Wheat Field A"
                  value={form.field}
                  onChange={(e) => setForm({ ...form, field: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Liters Used *</label>
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  type="number"
                  placeholder="Enter liters"
                  value={form.litersUsed}
                  onChange={(e) => setForm({ ...form, litersUsed: e.target.value })}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Status *</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  required
                >
                  <option value="Optimal">Optimal</option>
                  <option value="High">High</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Add Water Usage
            </button>
          </form>
        </motion.div>
      )}

      {waterUsage.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-lg text-center">
          <div className="text-6xl mb-4">💧</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Water Usage Data</h3>
          <p className="text-gray-600">
            Start tracking your water usage by adding your first field.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {waterUsage.map((usage) => (
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              key={usage._id || usage.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="aspect-video bg-blue-100 rounded-lg mb-4 overflow-hidden">
                <img
                  src={`https://source.unsplash.com/400x250/?farm,${usage.field}`}
                  alt={usage.field}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x250?text=Farm+Field";
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{usage.field}</h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  💧 <span className="font-semibold">{typeof usage.litersUsed === 'number' ? usage.litersUsed.toLocaleString() : usage.litersUsed}</span> liters
                </p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(usage.status)}`}>
                    {usage.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

