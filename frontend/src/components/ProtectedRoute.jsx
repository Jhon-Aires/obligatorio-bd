import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { fetchFromApi } from "../services/fetch";

const ProtectedRoute = ({ requireAdmin = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const checkAuth = async () => {
      try {
        const response = await fetchFromApi("/login/verificar-sesion");

        if (!response.ok) {
          throw new Error(data.mensaje || "Error al verificar sesión");
        }

        const data = await response.json();

        console.log("data", data);

        setIsAuthenticated(data.autenticado);
        setIsAdmin(data.es_administrador);
      } catch (error) {
        console.log("error", error);

        console.error("Error verificando autenticación:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        Verificando autenticación...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to='/iniciousuario' replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
