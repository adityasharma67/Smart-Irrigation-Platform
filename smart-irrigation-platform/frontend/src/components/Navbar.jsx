import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="bg-green-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-green-200">
          🌱 Smart Irrigation
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-yellow-300 font-semibold">
                Dashboard
              </Link>
              {user.role === "provider" && (
                <Link to="/create-proposal" className="hover:text-yellow-300 font-semibold">
                  Create Proposal
                </Link>
              )}
              <Link to="/water-usage" className="hover:text-yellow-300 font-semibold">
                Water Usage
              </Link>
              <span className="text-green-200">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-green-700 px-4 py-2 rounded hover:bg-green-800 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="hover:text-yellow-300 font-semibold">
                Home
              </Link>
              <Link to="/login" className="hover:text-yellow-300 font-semibold">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-700 px-4 py-2 rounded hover:bg-green-800 transition-colors font-semibold"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
