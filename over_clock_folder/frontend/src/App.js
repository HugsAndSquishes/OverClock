// src/App.js
import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./components/NavBar";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import AttendanceHistory from "./pages/AttendanceHistory";
import Leaderboard from "./pages/Leaderboard";
import Teams from "./pages/Teams";
import UserSettings from "./pages/UserSettings";
import Login from "./pages/Login";

import { apiFetch, ENDPOINTS } from './utils/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("logged_in") === "yes"
  );

  useEffect(() => {
    const verifyAuth = async () => {
      if (localStorage.getItem("logged_in") === "yes") {
        try {
          // Use our new utility
          const response = await apiFetch(ENDPOINTS.AUTHENTICATED);

          if (!response.ok) {
            localStorage.removeItem("logged_in");
            localStorage.removeItem("username");
            setIsAuthenticated(false);
          }
        } catch (err) {
          console.error("Auth verification failed:", err);
          localStorage.removeItem("logged_in");
          localStorage.removeItem("username");
          setIsAuthenticated(false);
        }
      }
    };

    verifyAuth();
  }, []);


  return (
    <>
      {isAuthenticated && <NavBar />}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/home" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/home" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route element={<RequireAuth />}>
          <Route
            path="/home"
            element={<Home setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/attendancehistory" element={<AttendanceHistory />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/usersettings" element={<UserSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;