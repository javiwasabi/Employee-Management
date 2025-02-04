import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const BACKEND_URL = "http://localhost:3001"; // Ajusta si es necesario

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);


    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Token en ProtectedRoute:", token);

        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        fetch(`${BACKEND_URL}/api/verify-token`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("Respuesta del backend:", data);
            setIsAuthenticated(data.valid);
        })
        .catch((error) => {
            console.error("Error en la verificación del token:", error);
            setIsAuthenticated(false);
        });
    }, []);

    if (isAuthenticated === null) return <p>Cargando...</p>;
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
