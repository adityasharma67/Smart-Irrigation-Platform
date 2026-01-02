import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import img1 from "../assets/1.jpg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";
import img4 from "../assets/4.jpg";

const images = [img1, img2, img3, img4];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">

      {/* HERO SLIDER */}
      <div className="relative h-screen overflow-hidden">

        <AnimatePresence>
          <motion.img
            key={index}
            src={images[index]}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{
              duration: 1.2,
              ease: "easeInOut"
            }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* DARK GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

        {/* HERO CONTENT */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white px-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              🌾 Smart Irrigation Platform
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto">
              Connect farmers with service providers for efficient irrigation solutions
            </p>

            <div className="flex gap-6 justify-center">
              <Link
                to="/register"
                className="bg-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
              >
                Register
              </Link>

              <Link
                to="/login"
                className="bg-white/90 text-green-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white transition"
              >
                Login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto mt-20">

        {/* FEATURES */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div whileHover={{ y: -8 }} className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">👨‍🌾</div>
            <h3 className="text-xl font-semibold text-green-700 mb-2">For Farmers</h3>
            <p className="text-gray-600">
              Browse irrigation proposals and find the best solutions for your crops
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -8 }} className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">💧</div>
            <h3 className="text-xl font-semibold text-green-700 mb-2">Water Management</h3>
            <p className="text-gray-600">
              Track water usage and optimize irrigation for better crop yields
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -8 }} className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-semibold text-green-700 mb-2">Service Providers</h3>
            <p className="text-gray-600">
              Create proposals and connect with farmers who need irrigation solutions
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
