import React from "react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md"
    >
      <h1 className="text-3xl font-bold text-green-700 mb-4">About Smart Irrigation</h1>
        <p className="text-gray-700 mb-4">
          The Smart Irrigation Platform connects farmers, irrigation service providers, and device manufacturers to streamline irrigation management through IoT technology. It helps improve irrigation efficiency, reduce water waste, and support healthier crop growth by enabling data-driven decisions.

          Our mission is to make sustainable and smart irrigation accessible to both small-scale and large-scale farms, empowering them with real-time insights and modern tools.

          Learn more about key features such as IoT-based water-usage tracking, proposal matching for irrigation solutions, location-based service discovery, and provider management tools, all available through an intuitive dashboard designed for ease of use.
        </p>
      
    </motion.div>
  );
}
