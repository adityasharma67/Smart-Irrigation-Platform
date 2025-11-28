import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CreateProposal({ token }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    targetCrops: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const targetCropsArray = form.targetCrops
        .split(",")
        .map((crop) => crop.trim())
        .filter((crop) => crop.length > 0);

      await axios.post(
        "http://localhost:4000/api/proposals",
        {
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
          targetCrops: targetCropsArray,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create proposal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold mb-2 text-green-700">Create Irrigation Proposal</h2>
        <p className="text-gray-600 mb-6">
          Create a new irrigation proposal for farmers to browse and connect with you.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Title *</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Smart Drip Irrigation System for Wheat"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe your irrigation solution in detail..."
              rows="4"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Price (₹) *</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              type="number"
              placeholder="Enter price in rupees"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Target Crops (comma-separated) *
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Wheat, Rice, Corn"
              value={form.targetCrops}
              onChange={(e) => setForm({ ...form, targetCrops: e.target.value })}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Separate multiple crops with commas (e.g., Wheat, Rice, Corn)
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Proposal"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

