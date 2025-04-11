import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ClockInOut() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [timestamp, setTimestamp] = useState(null);
  const [clockInTime, setClockInTime] = useState(null);
  const [totalHours, setTotalHours] = useState(0);
  const [todayHours, setTodayHours] = useState(0);

  const calculateHours = (startTime, endTime) => {
    const diff = endTime - startTime;
    return Math.round((diff / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimal places
  };

  const handleClock = () => {
    const currentTime = new Date();
    setIsClockedIn(!isClockedIn);
    setTimestamp(currentTime.toLocaleTimeString());
    
    if (!isClockedIn) {
      // Clocking In
      setClockInTime(currentTime);
    } else {
      // Clocking Out
      const hoursWorked = calculateHours(clockInTime, currentTime);
      setTotalHours(prev => prev + hoursWorked);
      setTodayHours(prev => prev + hoursWorked);
      setClockInTime(null);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="p-8 w-full max-w-md mx-4 bg-gray-700 rounded-2xl shadow-xl border border-gray-600">
        <div className="space-y-6">
          {/* Status Header */}
          <div className="text-center">
            <h2 className={`text-3xl font-bold ${
              isClockedIn ? "text-green-400" : "text-gray-100"
            }`}>
              {isClockedIn ? "Clocked In" : "Clocked Out"}
            </h2>
            {timestamp && (
              <p className="text-gray-300 mt-2">Last action: {timestamp}</p>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-600">
              <p className="text-sm text-gray-400">Today's Hours</p>
              <p className="text-2xl font-semibold text-gray-100">{todayHours.toFixed(2)}h</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-600">
              <p className="text-sm text-gray-400">Total Hours</p>
              <p className="text-2xl font-semibold text-gray-100">{totalHours.toFixed(2)}h</p>
            </div>
          </div>

          {/* Clock Button */}
          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="w-full"
          >
            <button
              onClick={handleClock}
              className={`w-full py-4 px-6 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:shadow-lg ${
                isClockedIn 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {isClockedIn ? "Clock Out" : "Clock In"}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
