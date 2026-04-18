import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Frequently asked questions to help users navigate the platform
const faqs = [
  {
    q: "How do I register as a farmer?",
    a: "Click 'Register' on the homepage, fill in your details, and select 'Farmer' as your role. You'll be redirected to your dashboard immediately.",
  },
  {
    q: "Can I switch my role from farmer to provider?",
    a: "Currently roles are set at registration. To change your role, please contact our support team and we'll update your account.",
  },
  {
    q: "How do service providers create proposals?",
    a: "Once logged in as a provider, click '+ Create Proposal' in the Navbar or Dashboard. Fill in the title, description, price, and target crops.",
  },
  {
    q: "How does water usage tracking work?",
    a: "Navigate to 'Water Usage' in the dashboard. Click '+ Add Entry' to log a field name, liters used, and the water status (Optimal/High/Low).",
  },
  {
    q: "Is my data safe on the platform?",
    a: "Yes. Smart Farming Hub uses JWT authentication and encrypted storage. Your data is never shared with third parties without consent.",
  },
];

// Real-time (simulated) status of our backend services
const statusItems = [
  { label: "API Server", status: "Operational", color: "bg-green-500" },
  { label: "Authentication", status: "Operational", color: "bg-green-500" },
  { label: "Database", status: "Operational", color: "bg-green-500" },
  { label: "File Storage", status: "Operational", color: "bg-green-500" },
];

export default function Support() {
  // Which FAQ is currently expanded
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="text-6xl mb-4">🛠️</div>
        <h1 className="theme-display text-5xl font-extrabold text-white mb-3">Support Center</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Get help with your account, proposals, and water usage tracking.
        </p>
      </motion.div>

      {/* Quick ways to get help */}
      <div className="grid md:grid-cols-3 gap-5 mb-12">
        {[
          { icon: "📧", title: "Email Support", desc: "adityasharma89000@gmail.com", href: "mailto:adityasharma89000@gmail.com", cta: "Send Email" },
          { icon: "📞", title: "Phone Support", desc: "+91 7007380157", href: "tel:7007380157", cta: "Call Now" },
          { icon: "💬", title: "Documentation", desc: "Read our setup and usage guides", href: "/about", cta: "View Docs" },
        ].map((item, i) => (
          <motion.a
            key={i}
            href={item.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="theme-card p-6 rounded-[1.5rem] text-center transition-all block"
          >
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
            <p className="text-gray-500 text-sm mb-3">{item.desc}</p>
            <span className="text-green-600 font-semibold text-sm">{item.cta} →</span>
          </motion.a>
        ))}
      </div>

      {/* Ensuring our services are running smoothly */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="theme-card rounded-[1.5rem] p-6 mb-12"
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="theme-display text-xl font-bold text-white">Platform Status</h2>
          <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">
            ● All Systems Operational
          </span>
        </div>
        <div className="space-y-3">
          {statusItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-none">
              <span className="text-gray-600 text-sm font-medium">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-gray-500 text-xs">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* FAQ section with smooth accordion animations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="theme-display text-3xl font-extrabold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="theme-card rounded-[1.5rem] overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex justify-between items-center p-5 text-left"
              >
                <span className="font-semibold text-gray-800 text-sm pr-4">{faq.q}</span>
                <motion.span
                  animate={{ rotate: openFaq === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-green-600 text-xl flex-shrink-0"
                >
                  ⌄
                </motion.span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-3">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* A friendly footer push for further assistance */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-lime-300 rounded-[2rem] p-10 text-slate-950 text-center"
      >
        <h2 className="theme-display text-2xl font-extrabold mb-2">Still need help?</h2>
        <p className="text-slate-800 mb-5 text-sm">Our support team usually responds within 4 hours.</p>
        <a
          href="mailto:adityasharma89000@gmail.com"
          className="inline-block rounded-2xl bg-slate-950 px-8 py-3 font-bold text-white transition-all hover:-translate-y-0.5 shadow-md"
        >
          📧 Email Us Now
        </a>
      </motion.div>
    </div>
  );
}
