import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

const ShowWorkers: React.FC = () => {
  const [searchRut, setSearchRut] = useState(""); 
  const [searchLastName, setSearchLastName] = useState(""); 
  const [workers, setWorkers] = useState<any[]>([]); 
  const [filteredWorkers, setFilteredWorkers] = useState<any[]>([]); 
  const [lastNames, setLastNames] = useState<{ [key: string]: string[] }>({}); 
  const [filteredLastNames, setFilteredLastNames] = useState<string[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<any | null>(null); 
  // Componente para redirigir a login si no está autenticado
  const AuthCheck = () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      return <Navigate to="/login" />;  
    }
  
    return <Navigate to="/" />; 
  };


  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get("/users"); 
        const workersData = response.data;
        setWorkers(workersData);
        setFilteredWorkers(workersData);


        const groupedLastNames: { [key: string]: string[] } = {};
        workersData.forEach((worker: any) => {
          const firstLetter = worker.apellidos.charAt(0).toUpperCase();
          if (!groupedLastNames[firstLetter]) {
            groupedLastNames[firstLetter] = [];
          }
          groupedLastNames[firstLetter].push(worker.apellidos);
        });

        setLastNames(groupedLastNames);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    fetchWorkers();
  }, []);

  // Filtrar por RUT
  const handleSearchRut = async () => {
    try {
      const response = await axios.get(`/users/search/rut/${searchRut}`);
      setFilteredWorkers(response.data ? [response.data] : []);
    } catch (error) {
      console.error("Error searching by RUT:", error);
    }
  };

  // Filtrar apellidos al buscar
  useEffect(() => {
    if (searchLastName.trim() === "") {
      setFilteredLastNames([]);
    } else {
      const allLastNames = Object.values(lastNames).flat();
      const filtered = allLastNames.filter((lastName) =>
        lastName.toLowerCase().includes(searchLastName.toLowerCase())
      );
      setFilteredLastNames(filtered);
    }
  }, [searchLastName, lastNames]);

  return (
  
    <div className="relative bg-blue min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src="fondo.png"
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />

      <div className="relative w-[500px] h-[550px] bg-transparent border-2 border-white/50 rounded-[20px] backdrop-blur-[20px] shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col justify-center items-center">
        <h2 className="text-white text-3xl font-Merriweather mb-[10%]">
          Buscar Funcionarios
        </h2>

        {/* Buscar por RUT */}
        <div className="w-full flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por RUT"
            value={searchRut}
            onChange={(e) => setSearchRut(e.target.value)}
            className="w-[70%] p-2 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none"
          />
          <button
            onClick={handleSearchRut}
            className="w-[20%] p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            Buscar
          </button>
        </div>

        {/* Buscar por Apellido */}
        <div className="w-full flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por Apellido"
            value={searchLastName}
            onChange={(e) => setSearchLastName(e.target.value)}
            className="flex-grow p-2 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none"
          />
        </div>

        {/* Scrollable List */}
        <div className="w-full h-64 overflow-y-auto bg-white/10 p-4 rounded-lg text-white">
          {searchLastName.trim() === "" ? (
            // Mostrar apellidos agrupados por letra
            Object.keys(lastNames)
              .sort()
              .map((letter) => (
                <div key={letter} className="mb-4">
                  <h3 className="font-bold text-lg">{letter}</h3>
                  <ul className="pl-4">
                    {lastNames[letter].map((lastName, index) => (
                      <li key={index} className="py-1">
                        {lastName}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
          ) : (
            // Mostrar apellidos filtrados
            <ul>
              {filteredLastNames.length > 0 ? (
                filteredLastNames.map((lastName, index) => (
                  <li key={index} className="py-1">
                    {lastName}
                  </li>
                ))
              ) : (
                <p>No se encontraron resultados</p>
              )}
            </ul>
          )}
        </div>

        {/* Lista de trabajadores */}
        <ul className="w-full max-h-[200px] overflow-y-auto text-white">
          {filteredWorkers.map((worker) => (
            <li
              key={worker.rut}
              onClick={() => setSelectedWorker(worker)}
              className="cursor-pointer p-2 hover:bg-blue-600 rounded-lg"
            >
              {worker.apellidos}, {worker.nombres}
            </li>
          ))}
        </ul>
      </div>

      {/* Popup con datos del trabajador */}
      {selectedWorker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Datos del Funcionario</h3>
            <p>
              <strong>Nombre:</strong> {selectedWorker.nombres}{" "}
              {selectedWorker.apellidos}
            </p>
            <p>
              <strong>RUT:</strong> {selectedWorker.rut}
            </p>
            <p>
              <strong>Cargo:</strong> {selectedWorker.cargo}
            </p>
            <p>
              <strong>Tipo de Contrato:</strong> {selectedWorker.tipoContrato}
            </p>
            <button
              onClick={() => setSelectedWorker(null)}
              className="mt-4 w-full p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowWorkers;
