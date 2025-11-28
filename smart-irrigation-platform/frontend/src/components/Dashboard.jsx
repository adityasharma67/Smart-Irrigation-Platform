import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Dashboard({ token, user }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/proposals");
      setProposals(res.data);
    } catch (err) {
      setError("Failed to load proposals. Please try again later.");
      console.error("Error fetching proposals:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading proposals...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-4xl font-bold text-green-700 mb-2">
            {user?.role === "farmer" ? "🌾 Farmer Dashboard" : "📊 Dashboard"}
          </h2>
          <p className="text-gray-600">Welcome, {user?.name}! Explore irrigation proposals.</p>
        </div>
        {user?.role === "provider" && (
          <Link
            to="/create-proposal"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            + Create Proposal
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {proposals.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-lg text-center">
          <div className="text-6xl mb-4">🌾</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Proposals Available</h3>
          <p className="text-gray-600 mb-4">
            {user?.role === "provider"
              ? "Create your first irrigation proposal to get started!"
              : "There are no irrigation proposals available at the moment."}
          </p>
          {user?.role === "provider" && (
            <Link
              to="/create-proposal"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Create Proposal
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map((p) => (
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              key={p._id || p.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
            >
              <div className="aspect-video bg-green-100 rounded-lg mb-4 overflow-hidden">
                <img
                  src={`https://source.unsplash.com/400x250/?irrigation,${p.targetCrops?.[0] || "farm"}`}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x250?text=Irrigation";
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{p.title}</h3>
              {p.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{p.description}</p>
              )}
              <p className="text-gray-500 text-sm mb-2">
                By: <span className="font-semibold">{p.proposer?.name || "Unknown"}</span>
              </p>
              {p.targetCrops && p.targetCrops.length > 0 && (
                <p className="text-gray-600 mb-3">
                  💧 For: <span className="font-semibold">{p.targetCrops.join(", ")}</span>
                </p>
              )}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <p className="text-green-600 font-bold text-xl">₹{p.price}</p>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  Active
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
