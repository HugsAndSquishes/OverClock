import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsList, BsX } from "react-icons/bs";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-gray-800 border-b border-gray-600">
      <div className="px-4 md:px-8 py-4">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-100 tracking-wider">
              <span className="text-[#c98c52]">Over</span>Clock
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-gray-100 font-medium relative group transition-colors"
            >
              Punch
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c98c52] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
            <Link
              to="/Leaderboard"
              className="text-gray-300 hover:text-gray-100 relative group transition-colors"
            >
              Leaderboard
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c98c52] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
            <Link
              to="/Teams"
              className="text-gray-300 hover:text-gray-100 relative group transition-colors"
            >
              Team
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c98c52] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
            <Link
              to="/AttendanceHistory"
              className="text-gray-300 hover:text-gray-100 relative group transition-colors"
            >
              Attendance History
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c98c52] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
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
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c98c52] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
              <Link
                to="/Leaderboard"
                className="text-gray-300 hover:text-gray-100 transition-colors relative group"
                onClick={toggleMenu}
              >
                Leaderboard
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c98c52] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
              <Link
                to="/Teams"
                className="text-gray-300 hover:text-gray-100 transition-colors relative group"
                onClick={toggleMenu}
              >
                Teams
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-100 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
              <Link
                to="/AdjustPunch"
                className="text-gray-300 hover:text-gray-100 transition-colors relative group"
                onClick={toggleMenu}
              >
                Attendance History
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-100 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;