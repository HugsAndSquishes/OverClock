import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiFetch, ENDPOINTS } from "../utils/api";

// REMOVE these redundant constants - they're already defined in the api.js utility
// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
// const API_CLOCK_ENDPOINT = `${API_BASE_URL}/api/clock/`;

export default function ClockInOut() {
  // State definitions remain the same
  const [employeeName, setEmployeeName] = useState(localStorage.getItem("username") || "Guest");
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [timestamp, setTimestamp] = useState(null);
  const [todayHours, setTodayHours] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // useEffect hooks remain the same
  useEffect(() => {
    const currentUsername = localStorage.getItem("username") || "Guest";
    if (currentUsername !== employeeName) {
        setEmployeeName(currentUsername);
    }
  }, [employeeName]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClock = async () => {
    setIsLoading(true);
    setError(null);
    const currentTime = new Date();
    const isoTime = currentTime.toISOString();

    const action = isClockedIn ? "clock_out" : "clock_in";
    let recordId = isClockedIn ? localStorage.getItem("clockRecordId") : null;

    try {
      // UPDATED: Use apiFetch utility instead of direct fetch
      const res = await apiFetch(ENDPOINTS.CLOCK, {
        method: "POST",
        body: JSON.stringify({
          action: action,
          timestamp: isoTime,
          employee_name: employeeName,
          id: recordId,
        }),
      });

      // Rest of the function remains the same
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 401) {
          setError("Authentication failed. Please log in again.");
        } else {
          setError(errorData.error || `HTTP error! status: ${res.status}`);
        }
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setTimestamp(currentTime.toLocaleTimeString());

      if (action === "clock_in") {
        setIsClockedIn(true);
        localStorage.setItem("clockRecordId", data.id);
      } else {
        setIsClockedIn(false);
        localStorage.removeItem("clockRecordId");
        if (data.hours !== undefined) {
          const hours = parseFloat(data.hours);
          setTodayHours(prev => prev + hours);
          setWeeklyHours(prev => prev + hours);
        }
      }
    } catch (err) {
      // Error handling remains the same
      if (!error && err.message !== "Authentication failed. Please log in again.") {
        console.error("Error during clock action:", err);
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="bg-gray-700 rounded-xl shadow-lg border border-gray-600 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-100">Employee Dashboard</h1>
              {/* Use state variable for display */}
              <p className="text-gray-300">Welcome, {employeeName}</p>
            </div>
            {/* ... rest of the header ... */}
             <div className="mt-4 md:mt-0 text-center md:text-right">
              <p className="text-sm text-gray-400">Current Time</p>
              <p className="text-xl font-medium text-gray-100">
                {currentTime.toLocaleTimeString()}
              </p>
              <p className="text-sm text-gray-300">
                {currentTime.toLocaleDateString()}
              </p>
            </div>
          </div>
        </header>

        {/* ... rest of the component, ensure credentials: 'include' is in handleClock fetch ... */}
         {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clock In/Out Card */}
          <div className="lg:col-span-2 bg-gray-700 rounded-xl shadow-lg border border-gray-600 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${
                isClockedIn ? "text-green-400" : "text-gray-100"
              }`}>
                {isClockedIn ? "Currently Clocked In" : "Currently Clocked Out"}
              </h2>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                isClockedIn ? "bg-green-900 text-green-200" : "bg-gray-600 text-gray-200"
              }`}>
                {isClockedIn ? "Active" : "Inactive"}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 rounded-full border-4 border-gray-600 mb-6 flex items-center justify-center">
                <motion.div
                  animate={{ scale: isClockedIn ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 2, repeat: isClockedIn ? Infinity : 0 }}
                  className={`w-full h-full rounded-full flex items-center justify-center text-5xl ${
                    isClockedIn ? "bg-green-900/20" : "bg-gray-600/20"
                  }`}
                >
                  {isClockedIn ? "🟢" : "⚪"}
                </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClock}
                disabled={isLoading}
                className={`w-full max-w-xs py-4 px-6 text-lg font-semibold rounded-xl transition-all duration-300 ${
                  isLoading
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : isClockedIn
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : isClockedIn ? "Clock Out" : "Clock In"}
              </motion.button>

              {timestamp && (
                <p className="mt-4 text-gray-300 text-sm">
                  Last action: {timestamp}
                </p>
              )}
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Today's Hours Card */}
            <div className="bg-gray-700 rounded-xl shadow-lg border border-gray-600 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-100">Today's Hours</h3>
                <div className="p-2 rounded-lg bg-blue-900/30 text-blue-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mb-2">
                <p className="text-3xl font-bold text-gray-100">{todayHours.toFixed(2)}</p>
                <p className="text-sm text-gray-400">hours worked</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-600">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Daily Target</span>
                  <span>8h</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min((todayHours / 8) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Weekly Hours Card */}
            <div className="bg-gray-700 rounded-xl shadow-lg border border-gray-600 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-100">Weekly Hours</h3>
                <div className="p-2 rounded-lg bg-purple-900/30 text-purple-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="mb-2">
                <p className="text-3xl font-bold text-gray-100">{weeklyHours.toFixed(2)}</p>
                <p className="text-sm text-gray-400">hours this week</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-600">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Weekly Target</span>
                  <span>40h</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${Math.min((weeklyHours / 40) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-gray-700 rounded-xl shadow-lg border border-gray-600 p-6">
              <h3 className="text-lg font-medium text-gray-100 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {timestamp ? (
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-3 w-3 rounded-full mt-1.5 ${
                      isClockedIn ? "bg-green-400" : "bg-red-500"
                    }`}></div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-100">
                        {isClockedIn ? "Clocked In" : "Clocked Out"}
                      </p>
                      <p className="text-sm text-gray-400">{timestamp}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}