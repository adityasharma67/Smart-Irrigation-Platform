import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API_BASE_URL from "../config/api";
import wheatImg from "../assets/wheat.jpg";
import riceImg from "../assets/rice.jpg";
import cornImg from "../assets/corn.jpg";
import barleyImg from "../assets/barley.jpg";
import otherImg from "../assets/other.jpg";

export default function CreateProposal({ token }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    targetCrops: [],
  });
  const [otherSelected, setOtherSelected] = useState(false);
  const [otherCrop, setOtherCrop] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [createdPayload, setCreatedPayload] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        // prepare payload crops (include custom "other" if selected)
        const payloadCrops = [...form.targetCrops];
        if (otherSelected && otherCrop.trim()) payloadCrops.push(otherCrop.trim());

        await axios.post(
          `${API_BASE_URL}/api/proposals`,
          {
            title: form.title,
            description: form.description,
            price: parseFloat(form.price),
            targetCrops: payloadCrops,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // show confirmation modal with images instead of immediate redirect
        setCreatedPayload({ title: form.title, targetCrops: payloadCrops });
        setShowConfirmation(true);
        // reset form for next use
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

          {/* Image URL removed per request */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Target Crops *</label>
              <p className="text-sm text-gray-500 mb-3">Tap to select one or more crops:</p>

              <div className="flex flex-wrap gap-2">
                {[
                  "Wheat",
                  "Rice",
                  "Corn",
                  "Maize",
                  "Barley",
                  "Other",
                ].map((crop) => {
                  const selected = crop === "Other" ? otherSelected : form.targetCrops.includes(crop);
                  return (
                    <button
                      type="button"
                      key={crop}
                      onClick={() => {
                        if (crop === "Other") {
                          setOtherSelected((s) => !s);
                        } else {
                          if (form.targetCrops.includes(crop)) {
                            setForm({ ...form, targetCrops: form.targetCrops.filter((c) => c !== crop) });
                          } else {
                            setForm({ ...form, targetCrops: [...form.targetCrops, crop] });
                          }
                        }
                      }}
                      className={`px-3 py-1 rounded-full border ${selected ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-200'} hover:shadow-sm focus:outline-none`}
                    >
                      {crop}
                    </button>
                  );
                })}

              </div>

              {otherSelected && (
                <div className="mt-3">
                  <label className="text-sm text-gray-700 font-medium block mb-1">Other crop name</label>
                  <input
                    type="text"
                    placeholder="e.g., Sorghum"
                    value={otherCrop}
                    onChange={(e) => setOtherCrop(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter a custom crop name to include in the proposal.</p>
                </div>
              )}

              <p className="text-sm text-gray-500 mt-2">You can select multiple crops.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">Preview</label>
              {form.targetCrops.length === 0 && !(otherSelected && otherCrop.trim()) ? (
                <div className="bg-gray-50 border border-gray-200 p-6 rounded">No crop selected</div>
              ) : (
                <div className="flex flex-wrap gap-4">
                    {(() => {
                      const allCrops = [...form.targetCrops, ...(otherSelected && otherCrop.trim() ? [otherCrop.trim()] : [])];
                      const localMap = {
                        wheat: wheatImg,
                        rice: riceImg,
                        corn: cornImg,
                        maize: cornImg,
                        barley: barleyImg,
                        other: otherImg,
                      };

                      const getImageForCrop = (cropName) => {
                        // If this is the custom other crop (user typed a name), show otherImg
                        if (otherSelected && otherCrop.trim() && cropName === otherCrop.trim()) return otherImg;
                        const key = String(cropName).toLowerCase();
                        if (localMap[key]) return localMap[key];
                        return `https://source.unsplash.com/400x250/?${encodeURIComponent(cropName)},farm`;
                      };

                      return allCrops.map((crop) => (
                        <div key={crop} className="w-48 bg-white rounded shadow-sm overflow-hidden">
                          <img
                            src={getImageForCrop(crop)}
                            alt={crop}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-2 text-center text-sm font-medium">{crop}</div>
                        </div>
                      ));
                    })()}
                </div>
              )}
            </div>
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

        {/* Confirmation modal shown after successful submit */}
        {showConfirmation && createdPayload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowConfirmation(false)} />
            <div className="relative bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
              <h3 className="text-2xl font-bold text-green-700 mb-3">Proposal Submitted</h3>
              <p className="text-sm text-gray-600 mb-4">Your proposal has been created. Here's a preview of the target crops you included.</p>

              <div className="flex flex-wrap gap-4 mb-4">
                {(() => {
                  const allCrops = createdPayload.targetCrops || [];
                  const localMap = {
                    wheat: wheatImg,
                    rice: riceImg,
                    corn: cornImg,
                    maize: cornImg,
                    barley: barleyImg,
                    other: otherImg,
                  };
                  const getImageForCrop = (cropName) => {
                    const key = String(cropName).toLowerCase();
                    if (localMap[key]) return localMap[key];
                    return `https://source.unsplash.com/400x250/?${encodeURIComponent(cropName)},farm`;
                  };

                  if (allCrops.length === 0) return <div className="text-gray-500">(no crops selected)</div>;

                  return allCrops.map((crop) => (
                    <div key={crop} className="w-40 bg-white rounded shadow-sm overflow-hidden">
                      <img src={getImageForCrop(crop)} alt={crop} className="w-full h-28 object-cover" />
                      <div className="p-2 text-center text-sm font-medium">{crop}</div>
                    </div>
                  ));
                })()}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Close
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

