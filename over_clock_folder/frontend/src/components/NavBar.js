import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BsList, BsX } from "react-icons/bs";
import { apiFetch, ENDPOINTS } from "../utils/api";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [isManager, setIsManager] = useState(localStorage.getItem("is_manager") === "yes");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    apiFetch(ENDPOINTS.AUTHENTICATED)
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        setUsername(data.username);
        setIsManager(data.is_manager);
        localStorage.setItem("is_manager", data.is_manager ? "yes" : "no");
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <header className="bg-gray-800 border-b border-gray-600">
      <div className="px-4 md:px-8 py-4">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-100 tracking-wider">
              <span className="text-[#c98c52]">Over</span>Clock
            </h1>
            {username && (
              <span className="ml-4 text-gray-300">Welcome, {username}!</span>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-gray-100 font-medium relative group transition-colors"
            >
              Punch
            </Link>
            <Link
              to="/leaderboard"
              className="text-gray-300 hover:text-gray-100 relative group transition-colors"
            >
              Leaderboard
            </Link>
            {/* Only show Team link if user is a manager */}
            {isManager && (
              <Link
                to="/teams"
                className="text-gray-300 hover:text-gray-100 relative group transition-colors"
              >
                Team
              </Link>
            )}
            <Link
              to="/attendancehistory"
              className="text-gray-300 hover:text-gray-100 relative group transition-colors"
            >
              Attendance History
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center">
            <button
              className="md:hidden text-gray-300 hover:text-gray-100 p-2"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <BsX size={24} /> : <BsList size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-6 px-4 border-t border-gray-600">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-[#c98c52] font-medium relative group"
                onClick={toggleMenu}
              >
                Punch
              </Link>
              <Link
                to="/leaderboard"
                className="text-gray-300 hover:text-gray-100 transition-colors relative group"
                onClick={toggleMenu}
              >
                Leaderboard
              </Link>
              {/* Only show Team link if user is a manager */}
              {isManager && (
                <Link
                  to="/teams"
                  className="text-gray-300 hover:text-gray-100 transition-colors relative group"
                  onClick={toggleMenu}
                >
                  Teams
                </Link>
              )}
              <Link
                to="/attendancehistory"
                className="text-gray-300 hover:text-gray-100 transition-colors relative group"
                onClick={toggleMenu}
              >
                Attendance History
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default NavBar;