import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import './index.css';
import "./styles/background.css";
import First from "./pages/Admin/fPage";
import LastP from "./pages/Admin/disponibilidad";
import PokemonCard from "./pages/Admin/poke";
import ShoWorkers from "./pages/Admin/visualizacion";
import { Login } from "./pages/Autentication/login";
import ProtectedRoute from "./context/ProtectedRoute"; 
import AgregarPermiso from "./pages/Admin/permisos";
import AgregarCapacitacion from "./pages/Admin/capacitacion";
import CalendarLanding from "./pages/Employee/disponibilidad";
import FirstLanding from "./pages/Employee/first";
import ShowWorkersEmployee from "./pages/Employee/visualizacion";
import UpdatePermissions from "./pages/Admin/updatepermissions";
import CreateUsers from "./pages/Admin/updateUsers";
document.title = "Permisos y capacitaciones";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<h1>Acceso denegado</h1>} />

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/" element={<First />} />
            <Route path="/admin/calendario" element={<LastP />} />
            <Route path="/admin/newuser" element={<PokemonCard />} />
            <Route path="/admin/usuarios" element={<ShoWorkers />} />
            <Route path="/admin/permisos" element={<AgregarPermiso />} />
            <Route path="/admin/capacitaciones" element={<AgregarCapacitacion />} />
            <Route path="/admin/updatePermisos" element={<UpdatePermissions />} />
            <Route path="/admin/updateUsers" element={<CreateUsers />} />
          </Route>



          <Route element={<ProtectedRoute allowedRoles={["usuario"]} />}>
            <Route path="/usuario" element={<FirstLanding />}  />
            <Route path="/usuario/Calendario" element={<CalendarLanding />} />
            <Route path="/usuario/Visualizacion" element={<ShowWorkersEmployee />} />
          
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </Suspense>
  </React.StrictMode>
);
