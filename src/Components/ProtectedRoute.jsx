import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Client-side gate for admin routes. The REAL protection is server-side: the
// session is an httpOnly cookie the browser can't read, and every admin API
// call is authorized by the backend. This flag only controls whether the admin
// shell renders; without the cookie, the API returns 401 and the app logs out.
const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("isAdminLoggedIn") === "true";

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default ProtectedRoute;
