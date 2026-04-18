import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  // We use this to toggle the menu on mobile devices
  const [menuOpen, setMenuOpen] = useState(false);

  // Helper function to sign the user out and clean up the state
  const handleLogout = () => {
    onLogout();
    navigate("/");
    setMenuOpen(false);
  };

  // Consistent styling for our navigation links
  const navLink =
    "rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-cyan-200";

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 shadow-[0_18px_60px_rgba(8,15,28,0.45)] backdrop-blur-2xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        
        {/* Our App Logo and Name */}
        <Link
          to="/"
          className="flex items-center gap-3 text-white font-extrabold text-xl tracking-tight"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-2xl shadow-lg shadow-cyan-500/20">
            🌿
          </span>
          <span className="theme-display hidden sm:inline text-white">Smart Farming Hub</span>
          <span className="theme-display sm:hidden text-white">Smart Hub</span>
        </Link>

        {/* Links shown on tablets and computers */}
        <div className="hidden lg:flex items-center gap-2 text-white">
          {user ? (
            <>
              {/* Logged in view */}
              <Link to="/dashboard" className={navLink}>📊 Dashboard</Link>
              <Link to="/smart-dashboard" className={navLink}>🧠 Smart Analytics</Link>
              <Link to="/crop-advisor" className={navLink}>🌾 Crop Advisor</Link>
              <Link to="/water-usage" className={navLink}>💧 Water Usage</Link>
              {user.role === "provider" && (
                <Link to="/create-proposal" className={navLink}>📝 Create Proposal</Link>
              )}
              <Link to="/about" className={navLink}>About</Link>
              <Link to="/contact" className={navLink}>Contact</Link>
              <div className="flex items-center gap-3 ml-2">
                {/* User's profile badge */}
                <div className="theme-chip rounded-full px-3 py-1.5 text-sm font-medium">
                  👤 {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-red-400/30 bg-red-500/15 px-4 py-1.5 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/25"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Logged out view */}
              <Link to="/" className={navLink}>Home</Link>
              <Link to="/about" className={navLink}>About</Link>
              <Link to="/contact" className={navLink}>Contact</Link>
              <Link to="/support" className={navLink}>Support</Link>
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-lime-300 px-4 py-1.5 text-sm font-bold text-slate-950 transition-all hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            </>
          )}
        </div>

        {/* The "Hamburger" icon for phones */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-6 origin-center bg-white"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-0.5 w-6 bg-white"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-6 origin-center bg-white"
            />
          </div>
        </button>
      </div>

      {/* The slide-down menu for mobile phones */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3 text-white">
              {user ? (
                <>
                  <Link to="/dashboard" className={navLink} onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
                  <Link to="/smart-dashboard" className={navLink} onClick={() => setMenuOpen(false)}>🧠 Smart Analytics</Link>
                  <Link to="/crop-advisor" className={navLink} onClick={() => setMenuOpen(false)}>🌾 Crop Advisor</Link>
                  <Link to="/water-usage" className={navLink} onClick={() => setMenuOpen(false)}>💧 Water Usage</Link>
                  {user.role === "provider" && (
                    <Link to="/create-proposal" className={navLink} onClick={() => setMenuOpen(false)}>📝 Create Proposal</Link>
                  )}
                  <Link to="/about" className={navLink} onClick={() => setMenuOpen(false)}>About</Link>
                  <Link to="/contact" className={navLink} onClick={() => setMenuOpen(false)}>Contact</Link>
                  <hr className="border-white/20" />
                  <span className="text-green-300 text-sm">👤 {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-400 text-sm font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/" className={navLink} onClick={() => setMenuOpen(false)}>Home</Link>
                  <Link to="/about" className={navLink} onClick={() => setMenuOpen(false)}>About</Link>
                  <Link to="/contact" className={navLink} onClick={() => setMenuOpen(false)}>Contact</Link>
                  <Link to="/support" className={navLink} onClick={() => setMenuOpen(false)}>Support</Link>
                  <hr className="border-white/20" />
                  <Link to="/login" className={navLink} onClick={() => setMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="text-emerald-400 font-bold text-sm" onClick={() => setMenuOpen(false)}>Register →</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
