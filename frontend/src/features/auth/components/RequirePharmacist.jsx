import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

// Wrap pharmacist routes to block access for non-pharmacist users.
export default function RequirePharmacist({ children }) {
  const { initialized, isAuthenticated, isPharmacist } = useAuth();
  const location = useLocation();

  // Wait until auth initialization to avoid flicker/false redirects
  if (!initialized) return null;

  if (!isAuthenticated || !isPharmacist) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return children;
}
