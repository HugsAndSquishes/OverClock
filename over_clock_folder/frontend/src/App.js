import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login       from "./pages/Login";
import Home        from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Teams       from "./pages/Teams";
import History     from "./pages/AttendanceHistory";

export default function App() {
  const [user, setUser] = useState(undefined);
  const nav = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/users/", { credentials: "include" })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(u => setUser(u))
      .catch(() => setUser(null));
  }, []);

  if (user === undefined) return <div className="text-white">Loading…</div>;

  const handleLogin = (u) => {
    setUser(u);
    nav("/punch", { replace: true });
  };
  const handleLogout = () => {
    fetch("http://localhost:8000/api/logout/", {
      method: "POST",
      credentials: "include"
    }).then(() => {
      setUser(null);
      nav("/login", { replace: true });
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/punch"
          element={ user ? <Home onLogout={handleLogout} /> : <Navigate to="/login" replace /> }
        />
        <Route
          path="/leaderboard"
          element={ user ? <Leaderboard /> : <Navigate to="/login" replace /> }
        />
        <Route
          path="/teams"
          element={ user ? <Teams /> : <Navigate to="/login" replace /> }
        />
        <Route
          path="/history"
          element={ user ? <History /> : <Navigate to="/login" replace /> }
        />
        <Route path="/" element={<Navigate to={user ? "/punch" : "/login"} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
