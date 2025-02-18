import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";


interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [userRole, setUserRole] = useState<string | null>(localStorage.getItem("role"));
    const [userRut, setUserRut] = useState<string | null>(localStorage.getItem("rut"));
    const [loading, setLoading] = useState<boolean>(true);
    

    useEffect(() => {
        console.log("useEffect se ejecutó");  
    
        const token = localStorage.getItem("token");
        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
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
                
                if (data.role) {
                    setUserRole(data.role);
                    localStorage.setItem("role", data.role);
                    localStorage.setItem("rut", data.rut);
                    console.log("Role obtenido del backend:", data.role);
                    console.log("Rut obtenido del backend:", data.rut);
                } else {
                    console.error("Role no definido en la respuesta del backend");
                }
            })
            
            .catch((error) => {
                console.error("Error en la verificación del token:", error);
                setIsAuthenticated(false);
            })
            .finally(() => setLoading(false));
    }, []);
    
    console.log("Estado de autenticación:", isAuthenticated);  // Verificar estado de autenticación
    console.log("Rol actual del usuario:", userRole);  // Verificar rol local almacenado
    console.log("el rut actual del usuario:", userRut);  // Verificar rol local almacenado

    if (loading) return <p>Cargando...</p>;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (!allowedRoles.includes(userRole!)) {
        console.log("Rol no permitido, redirigiendo a 'Unauthorized'.");
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
