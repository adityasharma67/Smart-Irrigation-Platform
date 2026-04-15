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
    "hover:text-cyan-300 transition-colors duration-200 font-medium text-sm";

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-cyan-900 to-emerald-900 shadow-xl border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Our App Logo and Name */}
        <Link
          to="/"
          className="flex items-center gap-2 text-white font-extrabold text-xl tracking-tight"
        >
          <span className="hidden sm:inline">Smart Farming Hub</span>
          <span className="sm:hidden">Smart Farming Hub</span>
        </Link>

        {/* Links shown on tablets and computers */}
        <div className="hidden lg:flex items-center gap-6 text-white">
          {user ? (
            <>
              {/* Logged in view */}
              <Link to="/dashboard" className={navLink}>Dashboard</Link>
              <Link to="/smart-dashboard" className={navLink}>🧠 Smart Analytics</Link>
              <Link to="/crop-advisor" className={navLink}>Crop Advisor</Link>
              <Link to="/water-usage" className={navLink}>💧 Water Usage</Link>
              {user.role === "provider" && (
                <Link to="/create-proposal" className={navLink}>📝 Create Proposal</Link>
              )}
              <Link to="/about" className={navLink}>About</Link>
              <Link to="/contact" className={navLink}>Contact</Link>
              <div className="flex items-center gap-3 ml-2">
                {/* User's profile badge */}
                <div className="bg-white/20 rounded-full px-3 py-1.5 text-sm font-medium">
                  {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
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
                  className="border border-white/50 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-400 text-green-900 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-emerald-300 transition-colors"
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
              className="block w-6 h-0.5 bg-white origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-0.5 bg-white"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-white origin-center"
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
            className="lg:hidden bg-green-900/95 backdrop-blur-sm border-t border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3 text-white">
              {user ? (
                <>
                  <Link to="/dashboard" className={navLink} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link to="/smart-dashboard" className={navLink} onClick={() => setMenuOpen(false)}>🧠 Smart Analytics</Link>
                  <Link to="/crop-advisor" className={navLink} onClick={() => setMenuOpen(false)}>Crop Advisor</Link>
                  <Link to="/water-usage" className={navLink} onClick={() => setMenuOpen(false)}>💧 Water Usage</Link>
                  {user.role === "provider" && (
                    <Link to="/create-proposal" className={navLink} onClick={() => setMenuOpen(false)}>📝 Create Proposal</Link>
                  )}
                  <Link to="/about" className={navLink} onClick={() => setMenuOpen(false)}>About</Link>
                  <Link to="/contact" className={navLink} onClick={() => setMenuOpen(false)}>Contact</Link>
                  <hr className="border-white/20" />
                  <span className="text-green-300 text-sm">{user.name}</span>
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
