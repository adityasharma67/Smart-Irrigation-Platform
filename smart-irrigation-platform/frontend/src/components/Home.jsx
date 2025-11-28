import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-green-700 mb-4">
          🌾 Smart Irrigation Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect farmers with service providers for efficient irrigation solutions
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/register"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="bg-white text-green-600 px-6 py-3 rounded-lg border-2 border-green-600 hover:bg-green-50 transition-colors font-semibold"
          >
            Login
          </Link>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="text-4xl mb-4">👨‍🌾</div>
          <h3 className="text-xl font-semibold text-green-700 mb-2">For Farmers</h3>
          <p className="text-gray-600">
            Browse irrigation proposals and find the best solutions for your crops
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="text-4xl mb-4">💧</div>
          <h3 className="text-xl font-semibold text-green-700 mb-2">Water Management</h3>
          <p className="text-gray-600">
            Track water usage and optimize irrigation for better crop yields
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="text-4xl mb-4">🔧</div>
          <h3 className="text-xl font-semibold text-green-700 mb-2">Service Providers</h3>
          <p className="text-gray-600">
            Create proposals and connect with farmers who need irrigation solutions
          </p>
        </motion.div>
      </div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-700">
              1
            </div>
            <h4 className="font-semibold mb-2">Register</h4>
            <p className="text-sm text-gray-600">Create your account as a farmer or service provider</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-700">
              2
            </div>
            <h4 className="font-semibold mb-2">Browse</h4>
            <p className="text-sm text-gray-600">Explore irrigation proposals or create your own</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-700">
              3
            </div>
            <h4 className="font-semibold mb-2">Connect</h4>
            <p className="text-sm text-gray-600">Connect with farmers or service providers</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-700">
              4
            </div>
            <h4 className="font-semibold mb-2">Manage</h4>
            <p className="text-sm text-gray-600">Track water usage and optimize irrigation</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

