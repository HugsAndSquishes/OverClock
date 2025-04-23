import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";

export default function RequireAuth() {
  const authed = localStorage.getItem("logged_in") === "yes";
  const location = useLocation();

  if (!authed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
}