import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// A list of what makes our platform special
const features = [
  { icon: "📡", title: "IoT Water Tracking", desc: "Real-time sensor data from your fields for precision irrigation decisions." },
  { icon: "🤝", title: "Proposal Matching", desc: "AI-assisted matching between farmer needs and provider solutions." },
  { icon: "📍", title: "Location-Based", desc: "Discover service providers near your farm for faster support." },
  { icon: "📊", title: "Analytics Dashboard", desc: "Visualize water usage trends and optimize your irrigation schedules." },
  { icon: "🔒", title: "Secure Platform", desc: "JWT-authenticated accounts keep your data safe and private." },
  { icon: "📱", title: "Mobile Friendly", desc: "Access your dashboard from any device, anywhere on your farm." },
];

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero section to introduce the mission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="text-7xl mb-6">🌿</div>
        <h1 className="theme-display text-5xl font-extrabold text-white mb-4">
          About <span className="text-green-600">Smart Farming Hub</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          We're on a mission to make smart, sustainable irrigation accessible to every farmer in India.
        </p>
      </motion.div>

      {/* A deeper look at why we exist */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="theme-surface rounded-[2rem] p-10 mb-12 text-white"
      >
        <h2 className="theme-display text-3xl font-extrabold mb-4">Our Mission</h2>
        <p className="text-green-100 text-lg leading-relaxed mb-6">
          Smart Farming Hub (Smart Irrigation Platform) connects farmers, irrigation service providers, and device manufacturers
          through a unified digital marketplace. We help improve irrigation efficiency, reduce water waste, and support
          healthier crop growth by enabling data-driven decisions.
        </p>
        <p className="text-green-100 text-lg leading-relaxed">
          Whether you're a smallholder farmer in rural Maharashtra or a large-scale agri-business in Punjab — our platform
          gives you the tools to irrigate smarter, not harder.
        </p>
      </motion.div>

      {/* Breaking down the features for the user */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Platform Features</h2>
        <p className="text-gray-500 mb-8">Everything you need for precision irrigation management.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="theme-card p-6 rounded-[1.5rem] transition-all"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="theme-display font-bold text-white mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* A final push to get them signed up */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-lime-300 rounded-[2rem] p-10 text-center text-slate-950"
      >
        <h2 className="theme-display text-3xl font-extrabold mb-3">Ready to Get Started?</h2>
        <p className="text-slate-800 mb-6">Join Smart Farming Hub and transform the way you manage irrigation.</p>
        <Link
          to="/register"
          className="inline-block rounded-2xl bg-slate-950 px-8 py-3 font-bold text-white transition-all hover:-translate-y-1 shadow-md"
        >
          Register for Free →
        </Link>
      </motion.div>
    </div>
  );
}
