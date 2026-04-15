import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Import the images for our slideshow
import img1 from "../assets/1.jpg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";
import img4 from "../assets/4.jpg";

const images = [img1, img2, img3, img4];

// The basic steps for new users to get started
const steps = [
  {
    step: "01",
    icon: "📝",
    title: "Register",
    desc: "Create your profile as a farmer, service provider, or manufacturer.",
  },
  {
    step: "02",
    icon: "🔍",
    title: "Browse Proposals",
    desc: "Explore smart irrigation solutions tailored for your crops.",
  },
  {
    step: "03",
    icon: "🤝",
    title: "Connect & Grow",
    desc: "Get in touch with providers and start saving water today.",
  },
];

// Highlighting why different users should join the platform
const benefits = {
  farmers: [
    { icon: "📈", title: "Increased Yields", desc: "Scientific irrigation schedules tailored to crop needs lead to healthier plants and better harvests." },
    { icon: "💰", title: "Cost Savings", desc: "Reduce electricity and water bills by up to 40% with automated, precision watering." },
    { icon: "⏱️", title: "Save Time", desc: "Monitor and control your irrigation from anywhere, reducing manual field visits." },
  ],
  providers: [
    { icon: "🌍", title: "Expanded Reach", desc: "Connect with thousands of farmers actively looking for irrigation solutions in your area." },
    { icon: "📊", title: "Business Growth", desc: "Manage multiple projects efficiently with our digital proposal and tracking tools." },
    { icon: "🏆", title: "Build Trust", desc: "Showcase your expertise and build a verified reputation through successful field implementations." },
  ]
};

export default function Home() {
  const [index, setIndex] = useState(0);

  // This effect runs the image slider automatically every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* Welcome Section with Hero Slider */}
      <div className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={images[index]}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Darkens the background image so text is easy to read */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-slate-900/55 to-black/80" />

        {/* Main Hero Text and Buttons */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-center text-white px-6 max-w-4xl"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6 flex justify-center"
            >
              <div className="relative three-d-float">
                <div className="three-d-orb" />
                <div className="three-d-ring" />
              </div>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight tracking-tight">
              Smart Irrigation
              <span className="block text-emerald-400">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connecting farmers with expert irrigation providers for smarter, sustainable crop growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:-translate-y-1"
              >
                Get Started Free →
              </Link>
              <Link
                to="/about"
                className="border-2 border-white/70 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>

            {/* Little dots at the bottom to show which slide we're on */}
            <div className="flex gap-2 justify-center mt-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-8 bg-emerald-400" : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bouncing arrow to encourage scrolling down */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-2xl"
        >
          ↓
        </motion.div>
      </div>

      {/* Highlights of the Platform */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">Features</span>
          <h2 className="text-4xl font-extrabold text-gray-800 mt-2">
            Everything You Need to Irrigate Smarter
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "FM",
              title: "For Farmers",
              desc: "Browse curated irrigation proposals, compare prices, and connect directly with trusted service providers.",
              bg: "from-green-50 to-emerald-50",
              border: "border-green-200",
            },
            {
              icon: "WA",
              title: "Water Analytics",
              desc: "Track real-time water usage across all your fields with smart status indicators and historical data.",
              bg: "from-blue-50 to-cyan-50",
              border: "border-blue-200",
            },
            {
              icon: "PR",
              title: "For Providers",
              desc: "Create detailed proposals, showcase your expertise, and reach thousands of farmers looking for solutions.",
              bg: "from-amber-50 to-orange-50",
              border: "border-amber-200",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`bg-gradient-to-br ${f.bg} p-8 rounded-2xl border ${f.border} shadow-md hover:shadow-xl transition-all duration-300 three-d-float`}
            >
              <div className="w-14 h-14 rounded-2xl mb-4 bg-white/80 border border-white/60 flex items-center justify-center text-2xl font-black text-slate-700">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <div className="bg-gradient-to-br from-green-800 to-emerald-900 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-emerald-300 font-semibold text-sm uppercase tracking-widest">Process</span>
            <h2 className="text-4xl font-extrabold text-white mt-2">How It Works</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative text-center"
              >
                {/* Visual connectors between steps */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-emerald-600/40" />
                )}
                <div className="bg-emerald-400/20 border border-emerald-400/30 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {s.icon}
                </div>
                <span className="text-emerald-400 font-bold text-xs tracking-widest">STEP {s.step}</span>
                <h3 className="text-white font-bold text-xl my-2">{s.title}</h3>
                <p className="text-green-200 leading-relaxed text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Benefits Section */}
      <div className="max-w-6xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">Why Smart Farming Hub?</span>
          <h2 className="text-4xl font-extrabold text-gray-800 mt-2">
            Beneficial For Everyone
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Benefits for the Farmers */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-green-50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <h3 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-3">
              For Farmers
            </h3>
            <div className="space-y-6">
              {benefits.farmers.map((b, i) => (
                <div key={i} className="flex gap-4">
                  <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{b.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/register"
              className="mt-8 inline-block text-green-600 font-bold hover:gap-2 transition-all"
            >
              Start saving water today →
            </Link>
          </motion.div>

          {/* Benefits for the Service Providers */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-emerald-50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <h3 className="text-2xl font-bold text-emerald-700 mb-6 flex items-center gap-3">
              🔧 For Service Providers
            </h3>
            <div className="space-y-6">
              {benefits.providers.map((b, i) => (
                <div key={i} className="flex gap-4">
                  <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{b.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/register"
              className="mt-8 inline-block text-emerald-600 font-bold hover:gap-2 transition-all"
            >
              Grow your business here →
            </Link>
          </motion.div>
        </div>
      </div>

      {/* final Call to Action */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 py-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-green-100 mb-8 text-lg">
            Join thousands of farmers and providers already using Smart Farming Hub.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-green-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-all hover:-translate-y-1 shadow-lg"
          >
            Start for Free Today →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
