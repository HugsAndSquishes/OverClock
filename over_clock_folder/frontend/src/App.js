// src/App.js
import "./App.css";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./components/NavBar";
import Home from "./pages/Home";                     // wraps ClockInOut
import AttendanceHistory from "./pages/AttendanceHistory";
import Leaderboard from "./pages/Leaderboard";
import Teams from "./pages/Teams";
import AdjustPunch from "./pages/AdjustPunch";
import UserSettings from "./pages/UserSettings";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <NavBar />

      <Routes>
        {/* root shows ClockIn/Out */}
        <Route path="/" element={<Home />} />

        {/* secondary pages */}
        <Route path="/attendancehistory" element={<AttendanceHistory />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/adjustpunch" element={<AdjustPunch />} />
        <Route path="/usersettings" element={<UserSettings />} />

        {/* auth */}
        <Route path="/login" element={<Login />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
