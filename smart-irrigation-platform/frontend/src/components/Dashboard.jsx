import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import API_BASE from "../config/api";

// These images help visualize the different crops mentioned in proposals
import wheatImg from "../assets/wheat.jpg";
import riceImg from "../assets/rice.jpg";
import cornImg from "../assets/corn.jpg";
import barleyImg from "../assets/barley.jpg";
import otherImg from "../assets/other.jpg";

// Additional generic irrigation and farm images for more variety
import img1 from "../assets/1.jpg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";
import img4 from "../assets/4.jpg";
import wateringImg from "../assets/watering.jpg";

// A quick map to link crop names to their respective images
const localCropMap = {
  wheat: wheatImg,
  rice: riceImg,
  corn: cornImg,
  maize: cornImg,
  barley: barleyImg,
  other: otherImg,
};

// Generic images to fallback to or cycle through for visual diversity
const genericPool = [img1, img2, img3, img4, wateringImg];

// Helper to pick a diverse image. It uses the proposal ID to make sure 
// the same proposal always gets the same image, but different proposals look different.
function getProposalImage(proposal) {
  const primaryCrop = String(proposal.targetCrops?.[0] || "").toLowerCase();
  
  // If we have a specific image for the crop, let's use it as a base
  const cropImage = localCropMap[primaryCrop];
  
  // We use the ID to pick a generic index so even "Wheat" proposals look different
  const idString = String(proposal._id || proposal.id || "0");
  const charCodeSum = idString.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  
  // Every 3rd proposal or so, let's show a generic high-quality farming image instead of a crop specific one
  if (charCodeSum % 3 === 0) {
    return genericPool[charCodeSum % genericPool.length];
  }
  
  // If no specific crop image or just by luck of the ID, use the generic pool
  return cropImage || genericPool[charCodeSum % genericPool.length] || otherImg;
}

// A placeholder card to show while we're still waiting for data to load
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
      <div className="skeleton aspect-video rounded-xl mb-4" />
      <div className="skeleton h-5 w-3/4 mb-2" />
      <div className="skeleton h-4 w-full mb-1" />
      <div className="skeleton h-4 w-2/3 mb-4" />
      <div className="flex justify-between">
        <div className="skeleton h-6 w-20" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export default function Dashboard({ token, user }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contactProposal, setContactProposal] = useState(null);

  // Load the latest proposals as soon as the dashboard opens
  useEffect(() => {
    fetchProposals();
  }, []);

  // Fetch all active proposals from our backend
  const fetchProposals = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/proposals`);
      setProposals(res.data);
    } catch (err) {
      setError("Failed to load proposals. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Allow service providers to remove their own proposals
  const handleDeleteProposal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this proposal?")) return;
    try {
      await axios.delete(`${API_BASE}/api/proposals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update our local list immediately so the UI feels snappy
      setProposals((prev) => prev.filter((p) => String(p._id || p.id) !== String(id)));
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message;
      setError(serverMessage || "Failed to delete proposal.");
    }
  };

  const activeCount = proposals.length;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome header with the user's name */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h2 className="text-4xl font-extrabold text-gray-800 mb-1">
              {user?.role === "farmer" ? "Farmer Dashboard" : "Dashboard"}
            </h2>
            <p className="text-gray-500">
              Welcome back, <span className="font-semibold text-green-700">{user?.name}</span>! 
              Here are the latest irrigation proposals.
            </p>
          </div>
          {/* Service providers see a button to create new listings */}
          {user && (
            <Link
              to="/create-proposal"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-bold shadow-md hover:shadow-green-400/30 hover:-translate-y-0.5"
            >
              + New Proposal
            </Link>
          )}
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Active Proposals", value: activeCount, icon: "📋", color: "bg-green-50 border-green-200 text-green-700" },
            { label: "My Role", value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "—", icon: "👤", color: "bg-blue-50 border-blue-200 text-blue-700" },
            { label: "Location", value: user?.location || "Not set", icon: "📍", color: "bg-amber-50 border-amber-200 text-amber-700" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`${s.color} border rounded-xl p-4 text-center`}
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-bold text-lg">{s.value}</div>
              <div className="text-xs opacity-70">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Smart Features Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              title: "🧠 Smart Analytics",
              desc: "AI-powered weather integration, sensor data analysis, and ML predictions for optimal irrigation.",
              link: "/smart-dashboard",
              gradient: "from-emerald-500 to-teal-600",
              badge: "ML & AI",
            },
            {
              title: "Crop Advisor",
              desc: "FAO-standard crop database with growth stages, Kc coefficients, and water calculators for 15+ crops.",
              link: "/crop-advisor",
              gradient: "from-green-500 to-emerald-600",
              badge: "15+ Crops",
            },
            {
              title: "📅 Smart Schedule",
              desc: "Weather-aware irrigation scheduling with Penman-Monteith ET₀, priority scoring, and savings analysis.",
              link: "/smart-dashboard",
              gradient: "from-blue-500 to-cyan-600",
              badge: "Automated",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Link
                to={card.link}
                className={`block bg-gradient-to-br ${card.gradient} rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold">{card.title}</h3>
                  <span className="text-[10px] font-bold bg-white/25 px-2 py-0.5 rounded-full">{card.badge}</span>
                </div>
                <p className="text-sm opacity-90 leading-relaxed mb-3">{card.desc}</p>
                <span className="text-sm font-semibold opacity-80">Explore →</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {/* The main list of irrigation proposals */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : proposals.length === 0 ? (
          // Empty state if nothing has been posted yet
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-16 rounded-2xl shadow-lg text-center border border-gray-100"
          >
            <div className="w-20 h-20 rounded-3xl mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-xl three-d-float" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Proposals Yet</h3>
            <p className="text-gray-500 mb-6">
              {user?.role === "provider"
                ? "Create your first irrigation proposal to connect with farmers!"
                : "There are no irrigation proposals available at the moment."}
            </p>
            {user?.role === "provider" && (
              <Link
                to="/create-proposal"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
              >
                Create First Proposal
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposals.map((p, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
                key={p._id || p.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group"
              >
                {/* Visual preview of the proposal based on target crops and unique ID */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={getProposalImage(p)}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      ● Active
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">{p.title}</h3>
                  {p.description && (
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{p.description}</p>
                  )}
                  <p className="text-gray-400 text-xs mb-2">
                    By <span className="font-semibold text-gray-600">{p.proposer?.name || "Unknown"}</span>
                  </p>
                  {/* Tags for the crops this proposal helps with */}
                  {p.targetCrops && p.targetCrops.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.targetCrops.map((c) => (
                        <span key={c} className="text-xs bg-green-50 text-green-700 font-medium px-2 py-0.5 rounded-full border border-green-100">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <p className="text-green-600 font-extrabold text-xl">₹{p.price?.toLocaleString()}</p>
                    <div className="flex items-center gap-2">
                      {/* Farmers get a contact button, while owners get a delete button */}
                      {user?.role === "farmer" && p.proposer?.email && (
                        <button
                          onClick={() => setContactProposal(p)}
                          className="bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          Contact
                        </button>
                      )}
                      {user && String(user.id || user._id) === String(p.proposer?._id || p.proposer?.id) && (
                        <button
                          onClick={() => handleDeleteProposal(p._id || p.id)}
                          className="bg-red-50 text-red-600 border border-red-200 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* A popup that shows contact details for a selected provider */}
      {contactProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setContactProposal(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl z-10"
          >
            <div className="text-4xl mb-3">📞</div>
            <h3 className="text-2xl font-bold text-green-700 mb-1">Contact Provider</h3>
            <p className="text-gray-500 text-sm mb-5">Reach out to discuss this irrigation proposal.</p>
            <div className="space-y-3 bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="text-sm"><strong>Name:</strong> {contactProposal.proposer?.name}</div>
              <div className="text-sm"><strong>Role:</strong> {contactProposal.proposer?.role || "Provider"}</div>
              {contactProposal.proposer?.location && (
                <div className="text-sm"><strong>Location:</strong> {contactProposal.proposer.location}</div>
              )}
              <div className="text-sm">
                <strong>Email:</strong>{" "}
                <a className="text-green-600 font-medium" href={`mailto:${contactProposal.proposer?.email}`}>
                  {contactProposal.proposer?.email}
                </a>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-5">
              <button
                onClick={() => navigator.clipboard?.writeText(contactProposal.proposer?.email || "")}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium"
              >
                Copy Email
              </button>
              <a
                href={`mailto:${contactProposal.proposer?.email}?subject=Interest in ${encodeURIComponent(contactProposal.title)}`}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm font-medium"
              >
                Send Email
              </a>
              <button onClick={() => setContactProposal(null)} className="px-4 py-2 rounded-lg bg-gray-50 text-gray-500 text-sm">
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
