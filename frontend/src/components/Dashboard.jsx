import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";
import wheatImg from "../assets/wheat.jpg";
import riceImg from "../assets/rice.jpg";
import cornImg from "../assets/corn.jpg";
import barleyImg from "../assets/barley.jpg";
import otherImg from "../assets/other.jpg";

export default function Dashboard({ token, user }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contactProposal, setContactProposal] = useState(null);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/proposals`);
      setProposals(res.data);
    } catch (err) {
      setError("Failed to load proposals. Please try again later.");
      console.error("Error fetching proposals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProposal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this proposal?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/proposals/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProposals((prev) =>
        prev.filter((p) => String(p._id || p.id) !== String(id))
      );
    } catch (err) {
      console.error("Error deleting proposal:", err);
      const serverMessage = err.response?.data?.message || err.message;
      setError(serverMessage || "Failed to delete proposal. Please try again.");
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
    <>
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-4xl font-bold text-green-700 mb-2">
            {user?.role === "farmer" ? "🌾 Farmer Dashboard" : "📊 Dashboard"}
          </h2>
          <p className="text-gray-600">
            Welcome, {user?.name}! Explore irrigation proposals or add your own.
          </p>
        </div>
        {user && (
          <Link
            to="/create-proposal"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            {user?.role === "provider" ? "+ Create Proposal" : "+ Add Proposal"}
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
                  src={(() => {
                    const firstCrop = p.targetCrops?.[0];
                    const key = String(firstCrop || "").toLowerCase();
                    const localMap = { wheat: wheatImg, rice: riceImg, corn: cornImg, maize: cornImg, barley: barleyImg, other: otherImg };
                    if (localMap[key]) return localMap[key];
                    return `https://source.unsplash.com/400x250/?irrigation,${firstCrop || "farm"}`;
                  })()}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = otherImg;
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
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    Active
                  </span>
                  {/* Contact button for farmers */}
                  {user?.role === "farmer" && p.proposer?.email && (
                    <button
                      onClick={() => setContactProposal(p)}
                      className="text-green-700 text-sm font-semibold hover:underline mr-2"
                    >
                      Contact
                    </button>
                  )}
                  {/* Show delete only to the proposer (owner) */}
                  {user && String(user.id || user._id) === String(p.proposer?._id || p.proposer?.id) && (
                    <button
                      onClick={() => handleDeleteProposal(p._id || p.id)}
                      className="text-red-600 text-sm font-semibold hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
    {/* Contact modal shown to farmers when they click Contact */}
    {contactProposal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={() => setContactProposal(null)} />
        <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
          <h3 className="text-2xl font-bold text-green-700 mb-2">Contact Provider</h3>
          <p className="text-gray-600 mb-4">Reach out to the proposer to discuss this offer.</p>

          <div className="space-y-2">
            <div className="text-sm text-gray-700"><strong>Name:</strong> {contactProposal.proposer?.name}</div>
            <div className="text-sm text-gray-700"><strong>Role:</strong> {contactProposal.proposer?.role || 'Provider'}</div>
            {contactProposal.proposer?.location && (
              <div className="text-sm text-gray-700"><strong>Location:</strong> {contactProposal.proposer.location}</div>
            )}
            <div className="text-sm text-gray-700"><strong>Email:</strong> <a className="text-green-600 font-medium" href={`mailto:${contactProposal.proposer?.email}?subject=Interest%20in%20${encodeURIComponent(contactProposal.title)}`}>{contactProposal.proposer?.email}</a></div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button onClick={() => navigator.clipboard?.writeText(contactProposal.proposer?.email || "")}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
              Copy Email
            </button>
            <a href={`mailto:${contactProposal.proposer?.email}?subject=Interest%20in%20${encodeURIComponent(contactProposal.title)}`} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Send Email</a>
            <button onClick={() => setContactProposal(null)} className="px-4 py-2 rounded-lg bg-gray-50">Close</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
