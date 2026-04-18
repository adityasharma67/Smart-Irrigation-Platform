import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API_BASE from "../config/api";

// These images help visualize the crops the user selects
import wheatImg from "../assets/wheat.jpg";
import riceImg from "../assets/rice.jpg";
import cornImg from "../assets/corn.jpg";
import barleyImg from "../assets/barley.jpg";
import otherImg from "../assets/other.jpg";

const localMap = { wheat: wheatImg, rice: riceImg, corn: cornImg, maize: cornImg, barley: barleyImg, other: otherImg };

// Helper to get the right preview image for a crop
function getCropImg(cropName) {
  const key = String(cropName || "").toLowerCase();
  return localMap[key] || otherImg;
}

// Common crops that we support by default
const CROP_OPTIONS = ["Wheat", "Rice", "Corn", "Maize", "Barley", "Other"];

export default function CreateProposal({ token }) {
  // Local state for our proposal form
  const [form, setForm] = useState({ title: "", description: "", price: "", targetCrops: [] });
  const [otherSelected, setOtherSelected] = useState(false);
  const [otherCrop, setOtherCrop] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [createdPayload, setCreatedPayload] = useState(null);
  const navigate = useNavigate();

  // Handle the form submission to create a new irrigation proposal
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payloadCrops = [...form.targetCrops];
      // If the user typed a custom crop name, we add it to the list
      if (otherSelected && otherCrop.trim()) payloadCrops.push(otherCrop.trim());

      // We need at least one crop to make a proposal useful
      if (payloadCrops.length === 0) {
        setError("Please select at least one target crop.");
        setLoading(false);
        return;
      }

      await axios.post(
        `${API_BASE}/api/proposals`,
        { title: form.title, description: form.description, price: parseFloat(form.price), targetCrops: payloadCrops },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Show the success modal and reset everything
      setCreatedPayload({ title: form.title, targetCrops: payloadCrops });
      setShowConfirmation(true);
      setForm({ title: "", description: "", price: "", targetCrops: [] });
      setOtherSelected(false);
      setOtherCrop("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create proposal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="theme-card rounded-[2rem] overflow-hidden"
      >
        {/* Top banner to set the mood */}
        <div className="bg-gradient-to-r from-slate-950 via-cyan-950 to-emerald-900 p-8 text-white">
          <div className="text-4xl mb-3">📝</div>
          <h2 className="theme-display text-3xl font-extrabold mb-1">Create Proposal</h2>
          <p className="text-green-100 text-sm">Offer your irrigation solution to farmers across India</p>
        </div>

        <div className="p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm"
            >
               {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Proposal Title *</label>
              <input
                className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-colors text-sm outline-none"
                placeholder="e.g., Smart Drip Irrigation for Wheat Fields"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Description</label>
              <textarea
                className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-colors text-sm outline-none resize-none"
                placeholder="Describe your irrigation solution in detail — technology used, coverage area, etc."
                rows="4"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Price (₹) *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                <input
                  className="w-full pl-8 p-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-colors text-sm outline-none"
                  type="number"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* A nice button-based selector for common crops */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Target Crops *</label>
              <p className="text-xs text-gray-400 mb-3">Select one or more crops this proposal is designed for</p>
              <div className="flex flex-wrap gap-2">
                {CROP_OPTIONS.map((crop) => {
                  const selected = crop === "Other" ? otherSelected : form.targetCrops.includes(crop);
                  return (
                    <button
                      type="button"
                      key={crop}
                      onClick={() => {
                        if (crop === "Other") {
                          setOtherSelected((s) => !s);
                        } else {
                          setForm({
                            ...form,
                            targetCrops: selected
                              ? form.targetCrops.filter((c) => c !== crop)
                              : [...form.targetCrops, crop],
                          });
                        }
                      }}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                        selected
                          ? "border-green-500 bg-green-600 text-white shadow-md"
                          : "border-gray-200 text-gray-600 hover:border-green-300 bg-white"
                      }`}
                    >
                      {crop}
                    </button>
                  );
                })}
              </div>
              {/* Extra input field if they select 'Other' */}
              {otherSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3"
                >
                  <input
                    type="text"
                    placeholder="Enter custom crop name (e.g., Sorghum)"
                    value={otherCrop}
                    onChange={(e) => setOtherCrop(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 text-sm outline-none"
                  />
                </motion.div>
              )}
            </div>

            {/* Real-time preview of the crops they're selecting */}
            {(form.targetCrops.length > 0 || (otherSelected && otherCrop.trim())) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Crop Preview</label>
                <div className="flex flex-wrap gap-3">
                  {[...form.targetCrops, ...(otherSelected && otherCrop.trim() ? [otherCrop.trim()] : [])].map((crop) => (
                    <div key={crop} className="w-32 bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                      <img src={getCropImg(crop)} alt={crop} className="w-full h-24 object-cover" />
                      <div className="p-2 text-center text-xs font-semibold text-gray-700">{crop}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-gray-100 text-gray-700 p-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3.5 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 shadow-md"
                disabled={loading}
              >
                {/* Visual indicator that things are happening */}
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : "Create Proposal →"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* A popup to celebrate the successful creation of the proposal */}
      {showConfirmation && createdPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirmation(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-2xl p-8 w-full max-lg shadow-2xl z-10"
          >
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-2xl font-bold text-green-700">Proposal Created!</h3>
              <p className="text-gray-500 text-sm mt-2">
                "{createdPayload.title}" is now live and visible to farmers.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {createdPayload.targetCrops.map((crop) => (
                <div key={crop} className="w-28 bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <img src={getCropImg(crop)} alt={crop} className="w-full h-20 object-cover" />
                  <div className="p-1.5 text-center text-xs font-semibold">{crop}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium text-sm"
              >
                Create Another
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 font-bold text-sm"
              >
                View Dashboard →
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
