import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  // Managing the contact form state
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Simulated form submission since we don't have a dedicated contact API yet
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Fake a small delay to make it feel like it's sending
    await new Promise((r) => setTimeout(r, 1200));
    setSuccess(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
    // Hide the success message after 5 seconds
    setTimeout(() => setSuccess(false), 5000);
  };

  // Direct ways for users to reach us
  const contacts = [
    { icon: "📧", label: "Email", value: "adityasharma89000@gmail.com", href: "mailto:adityasharma89000@gmail.com" },
    { icon: "📞", label: "Phone", value: "+91 7007380157", href: "tel:7007380157" },
    { icon: "📍", label: "Location", value: "Uttar Pradesh, India", href: null },
    { icon: "⏰", label: "Support Hours", value: "Mon–Sat, 9 AM – 6 PM IST", href: null },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page header to invite users to reach out */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="text-6xl mb-4">📬</div>
        <h1 className="theme-display text-5xl font-extrabold text-white mb-3">Get In Touch</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Have questions, feedback, or partnership inquiries? We'd love to hear from you.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* The message form itself */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="theme-card rounded-[2rem] p-8"
        >
          <h2 className="theme-display text-2xl font-bold text-white mb-6">Send a Message</h2>

          {/* Celebration message after a successful send */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm"
            >
              ✅ Message sent successfully! We'll get back to you within 24 hours.
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Your Name *</label>
                <input
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-colors text-sm outline-none"
                  placeholder="Rajesh Kumar"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Email *</label>
                <input
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-colors text-sm outline-none"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Subject *</label>
              <input
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-colors text-sm outline-none"
                placeholder="How can we help?"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Message *</label>
              <textarea
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-colors text-sm outline-none resize-none"
                placeholder="Tell us more about your query..."
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3.5 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 shadow-md"
            >
              {/* Spinner to show we're working on it */}
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Sending...
                </span>
              ) : "Send Message →"}
            </button>
          </form>
        </motion.div>

        {/* Handy contact information card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-5"
        >
          <div className="theme-surface rounded-[2rem] p-8 text-white mb-2">
            <h2 className="theme-display text-2xl font-bold mb-2">Contact Information</h2>
            <p className="text-green-200 text-sm">Reach us directly through any of these channels.</p>
          </div>

          {contacts.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="theme-card rounded-[1.5rem] p-5 flex items-center gap-4"
            >
              <div className="text-3xl bg-green-50 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                {c.icon}
              </div>
              <div>
                <div className="text-gray-400 text-xs font-semibold uppercase tracking-wide">{c.label}</div>
                {c.href ? (
                  <a href={c.href} className="text-green-700 font-semibold hover:underline text-sm">
                    {c.value}
                  </a>
                ) : (
                  <div className="text-gray-700 font-semibold text-sm">{c.value}</div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
