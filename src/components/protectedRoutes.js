import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const tokenData = JSON.parse(localStorage.getItem("token"));
  if (!tokenData) return <Navigate to="/login" />;

  const currentTime = new Date().getTime();
  if (currentTime > tokenData.expiryTime) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
