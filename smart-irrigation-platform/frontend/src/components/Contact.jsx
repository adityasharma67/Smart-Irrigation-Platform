import React from "react";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md"
    >
      <h1 className="text-3xl font-bold text-green-700 mb-4">Contact Us</h1>
      <p className="text-gray-700 mb-4">Have questions or feedback? Reach out below.</p>

      <form className="grid gap-4">
        <input placeholder="Your name" className="border p-2 rounded" />
        <input placeholder="Your email" className="border p-2 rounded" />
        <textarea placeholder="Message" className="border p-2 rounded h-32" />
        <button type="button" className="bg-green-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </form>
    </motion.div>
  );
}
