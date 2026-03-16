import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import CreateProposal from "./components/CreateProposal";
import WaterUsage from "./components/WaterUsage";
import About from "./components/About";
import Contact from "./components/Contact";
import Support from "./components/Support";

// This is what people see if they wander into a part of the app that doesn't exist
function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-9xl mb-4">🌾</div>
      <h1 className="text-5xl font-bold text-green-700 mb-3">404</h1>
      <p className="text-xl text-gray-500 mb-6">Oops! This field doesn't exist.</p>
      <a href="/" className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
        Back to Home
      </a>
    </div>
  );
}

function App() {
  // We keep track of the user's login token so they stay logged in between visits
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token") || null;
    } catch {
      return null;
    }
  });

  // We also save basic info about the logged-in user
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  // Whenever the login token changes, we make sure it's safely stored in the browser
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // We do the same for the user information
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Helper to handle the login process
  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  // Helper to clear everything out when someone logs out
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Our main navigation bar */}
        <Navbar user={user} onLogout={handleLogout} />
        
        <div className="container mx-auto px-4 py-8">
          {/* Here we define which page to show based on the web address */}
          <Routes>
            <Route
              path="/"
              element={token ? <Navigate to="/dashboard" replace /> : <Home />}
            />
            <Route
              path="/login"
              element={token ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />}
            />
            <Route
              path="/register"
              element={token ? <Navigate to="/dashboard" replace /> : <Register onRegister={handleLogin} />}
            />
            {/* These routes are only for people who are logged in */}
            <Route
              path="/dashboard"
              element={token ? <Dashboard token={token} user={user} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/create-proposal"
              element={token ? <CreateProposal token={token} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/water-usage"
              element={token ? <WaterUsage token={token} user={user} /> : <Navigate to="/login" replace />}
            />
            {/* General informational pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/support" element={<Support />} />
            {/* Catch any mistakes in the URL */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
