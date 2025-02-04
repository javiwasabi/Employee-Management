// index.tsx
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import './index.css';
import First from "./pages/fPage";
import Game from "./pages/mPage";
import LastP from "./pages/disponibilidad";
import PokemonCard from "./pages/poke";
import ShoWorkers from "./pages/visualizacion";
import { Login } from "./pages/login";
import ProtectedRoute from "./components/ProtectedRoute"; // <-- Importa ProtectedRoute

document.title = "Pokemón vs Tecnología";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>

        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<First/>} />
              <Route path="/guess" element={<Game />} />
              <Route path="/p" element={<LastP />} />
              <Route path="/poke" element={<PokemonCard />} />
              <Route path="/usuarios" element={<ShoWorkers />} />
            </Route>
          </Routes>
        </BrowserRouter>

    </Suspense>
  </React.StrictMode>
);
