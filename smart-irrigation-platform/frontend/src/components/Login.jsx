import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API_BASE from "../config/api";

export default function Login({ onLogin }) {
  // Local state to manage what the user types into the login form
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  // This function sends the login request to our backend server
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, form);
      // If successful, we save the token and user info and head to the dashboard
      onLogin(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      // Show a friendly error message if things go wrong
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="theme-card rounded-[2rem] overflow-hidden"
        >
          {/* A friendly welcome banner at the top of the card */}
          <div className="bg-gradient-to-r from-slate-950 via-cyan-950 to-emerald-900 p-8 text-white text-center">
            <div className="text-5xl mb-3">🌿</div>
            <h2 className="theme-display text-3xl font-extrabold mb-1">Welcome Back</h2>
            <p className="text-green-100 text-sm">Login to your Smart Farming Hub account</p>
          </div>

          <div className="p-8">
            {/* Display any problems that occurred during login */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 flex items-center gap-2 text-sm"
              >
                ⚠️ {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Email Address</label>
                <input
                  className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-green-500 transition-colors text-sm outline-none"
                  placeholder="you@example.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Password</label>
                <div className="relative">
                  <input
                    className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-green-500 transition-colors text-sm outline-none pr-12"
                    placeholder="Enter your password"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  {/* Toggles whether the user can see their password as they type */}
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
              <button
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3.5 rounded-xl font-bold text-base hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-green-400/30"
                type="submit"
                disabled={loading}
              >
                {/* Visual feedback while the server is thinking */}
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  "Login →"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-green-600 font-bold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
