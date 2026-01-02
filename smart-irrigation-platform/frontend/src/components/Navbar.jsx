import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <>
      <nav className="bg-green-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:text-green-200">
            Smart Farming Hub
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
                <Link to="/about" className="hover:text-yellow-300 font-semibold">
                  About
                </Link>
                <Link to="/contact" className="hover:text-yellow-300 font-semibold">
                  Contact
                </Link>
                <Link to="/support" className="hover:text-yellow-300 font-semibold">
                  Support
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

      {/* Bottom bar shown only after login: About / Contact / Support */}
      {user && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white/95 text-slate-800 rounded-full px-3 py-2 shadow-lg flex items-center gap-4">
            <Link to="/about" className="px-3 py-1 rounded-full hover:bg-slate-100 transition text-sm font-medium">
              About
            </Link>
            <Link to="/contact" className="px-3 py-1 rounded-full hover:bg-slate-100 transition text-sm font-medium">
              Contact
            </Link>
            <Link to="/support" className="px-3 py-1 rounded-full hover:bg-slate-100 transition text-sm font-medium">
              Support
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
