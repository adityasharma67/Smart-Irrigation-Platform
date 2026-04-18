import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API_BASE from "../config/api";

// The different types of users who can join the community
const roleOptions = [
  { value: "farmer", label: "👨‍🌾 Farmer", desc: "Find irrigation solutions for your crops" },
  { value: "provider", label: "🔧 Service Provider", desc: "Offer irrigation services to farmers" },
  { value: "manufacturer", label: "🏭 Manufacturer", desc: "Supply irrigation equipment and devices" },
];

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Puducherry",
];

const citySuggestions = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangalore"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
  "Punjab": ["Chandigarh", "Ludhiana", "Amritsar"],
  "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"],
  "West Bengal": ["Kolkata", "Darjeeling", "Howrah"],
  "Delhi": ["New Delhi", "Dwarka", "Rohini"],
};

export default function Register({ onRegister }) {
  // We keep track of everything the user puts into the signup form
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer",
    state: "",
    city: "",
    cropType: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  // Sends the new account details to our server to get registered
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const location = form.city && form.state ? `${form.city}, ${form.state}` : form.city || form.state || "";
    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, {
        ...form,
        location,
      });
      // Once they're in, we save their login info and take them to their new dashboard
      onRegister(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      // If something's wrong (like an email already in use), we let them know
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-8">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="theme-card rounded-[2rem] overflow-hidden"
        >
          {/* A bright banner to welcome new members */}
          <div className="bg-gradient-to-r from-slate-950 via-cyan-950 to-emerald-900 p-8 text-white text-center">
            <div className="text-5xl mb-3">🌱</div>
            <h2 className="theme-display text-3xl font-extrabold mb-1">Create Account</h2>
            <p className="text-green-100 text-sm">Join thousands of farmers and providers on Smart Farming Hub</p>
          </div>

          <div className="p-8">
            {/* Displaying any errors that pop up during the registration process */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2"
              >
                 {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Full Name</label>
                <input
                  className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-colors text-sm outline-none"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Email Address</label>
                <input
                  className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-colors text-sm outline-none"
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
                    className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-colors text-sm outline-none pr-12"
                    placeholder="Create a strong password"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={6}
                  />
                  {/* Toggles if the password characters are visible */}
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Choosing the right type of account */}
              <div>
                <label className="block text-gray-700 font-semibold mb-3 text-sm">I am a...</label>
                <div className="grid grid-cols-1 gap-2">
                  {roleOptions.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: r.value })}
                      className={`text-left px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                        form.role === r.value
                          ? "border-green-500 bg-green-50 text-green-800"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      <span className="font-semibold">{r.label}</span>
                      <span className="text-xs text-gray-500 ml-2">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">State</label>
                  <select
                    className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-colors text-sm outline-none bg-white"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value, city: "" })}
                  >
                    <option value="">Choose a state</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">City</label>
                  <input
                    className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-colors text-sm outline-none"
                    placeholder="Select or type a city"
                    value={form.city}
                    list="citySuggestions"
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                  <datalist id="citySuggestions">
                    {(form.state ? citySuggestions[form.state] || [] : Object.values(citySuggestions).flat())
                      .filter(Boolean)
                      .map((city) => (
                        <option key={city} value={city} />
                      ))}
                  </datalist>
                </div>
              </div>

              {/* Extra field just for farmers to tell us what they grow */}
              {form.role === "farmer" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Primary Crop</label>
                  <input
                    className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-colors text-sm outline-none"
                    placeholder="e.g., Wheat, Rice, Cotton"
                    value={form.cropType}
                    onChange={(e) => setForm({ ...form, cropType: e.target.value })}
                  />
                </motion.div>
              )}

              <button
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3.5 rounded-xl font-bold text-base hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 shadow-md mt-2"
                type="submit"
                disabled={loading}
              >
                {/* Shows a loading spinner while we're setting up the account */}
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  "Create Account →"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-gray-500 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 font-bold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
