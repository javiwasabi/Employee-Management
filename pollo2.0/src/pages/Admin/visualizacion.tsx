import React, { useState, useEffect } from "react"; 
import axios from "axios"; 
const ITEMS_PER_PAGE = 6;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const ShowWorkers: React.FC = () => {
  const [searchRut, setSearchRut] = useState(""); 
  const [selectedWorker, setSelectedWorker] = useState<any | null>(null); 
  const [permissions, setPermissions] = useState<any[]>([]); 
  const [showPermissionsPopup, setShowPermissionsPopup] = useState(false);
  const [training, setTraining] = useState<any[]>([]); 
  const [showtraining, setShowtraining] = useState(false);
  

  const fetchWorkerByRut = async (rut: string) => {
    if (rut.trim().length === 0) {
      setSelectedWorker(null);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/users/${rut}`);
      console.log("Datos del trabajador:", response.data); 
      setSelectedWorker(response.data);
    } catch (error) {
      console.error("Error al obtener los datos del trabajador:", error);
      setSelectedWorker(null);
    }
  };

  const fetchPermissionsByRut = async (rut: string) => {
    if (rut.trim().length === 0) {
      setPermissions([]);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/permisos/listar/${rut}`);
      console.log("Permisos del trabajador:", response.data);
      setPermissions(response.data);
    } catch (error) {
      console.error("Error al obtener los permisos del trabajador:", error);
      setPermissions([]); 
    }
  };

  const fetchtrainingsByRut = async (rut: string) => {
    if (rut.trim().length === 0) {
      setTraining([]);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/capacitaciones/listar/${rut}`);
      console.log("Capacitaciones del trabajador:", response.data);
      setTraining(response.data.capacitaciones); 
    } catch (error) {
      console.error("Error al obtener las capacitaciones del trabajador:", error);
      setTraining([]); 
    }
  };

  useEffect(() => {
    if (searchRut.trim().length > 0) {
      fetchWorkerByRut(searchRut);
      fetchPermissionsByRut(searchRut); 
      fetchtrainingsByRut(searchRut); 
    } else {
      setSelectedWorker(null); 
      setPermissions([]); 
    }
  }, [searchRut]);

  return (
  <div className="relative bg-gradient-to-r from-gray-600 to-white min-h-screen flex items-center justify-center overflow-hidden p-4">
    <div className="relative w-full max-w-lg bg-transparent border-2 border-white/50 rounded-xl backdrop-blur-xl shadow-lg flex flex-col justify-center items-center p-6">
      <h2 className="text-white text-3xl font-Merriweather mb-6 text-center">Buscar Funcionarios</h2>

      <input
        type="text"
        placeholder="Buscar por RUT EJ: 123456-7"
        value={searchRut}
        onChange={(e) => setSearchRut(e.target.value)}
        className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none"
      />
    </div>

    {selectedWorker && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h3 className="text-xl font-bold mb-4 text-center">Datos del Funcionario</h3>
          <p><strong>Nombre:</strong> {selectedWorker.user.nombres} {selectedWorker.user.apellidos}</p>
          <p><strong>RUT:</strong> {selectedWorker.user.rut}</p>
          <p><strong>Cargo:</strong> {selectedWorker.user.cargo}</p>
          <p><strong>Tipo de Contrato:</strong> {selectedWorker.user.tipoContrato}</p>
          <p><strong>Feriados Legales:</strong> {selectedWorker.user.feriadoLegal}</p>
          <p><strong>Días Administrativos:</strong> {selectedWorker.user.diasAdministrativos}</p>
          <p><strong>Horas Compensatorias:</strong> {selectedWorker.user.horasCompensatorias}</p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => setShowPermissionsPopup(true)}
              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >Ver Permisos</button>
            <button
              onClick={() => setShowtraining(true)}
              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >Ver Capacitaciones</button>
            <button
              onClick={() => setSelectedWorker(null)}
              className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 col-span-1 sm:col-span-2"
            >Cerrar</button>
          </div>
        </div>
      </div>
    )}

    {showPermissionsPopup && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
          <h3 className="text-xl font-bold mb-4 text-center">Permisos del Funcionario</h3>
          {permissions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {permissions.flatMap((permiso, index) => (
                permiso.permisos.map((permisoItem: any, subIndex: any) => (
                  <div key={`${index}-${subIndex}`} className="border p-4 rounded-lg shadow-md bg-gray-100">
                    <p><strong>Tipo:</strong> {permisoItem.tipoPermiso}</p>
                    <p><strong>Estado:</strong> {permisoItem.estado}</p>
                    <p><strong>Solicitud:</strong> {new Date(permisoItem.fechaSolicitud).toLocaleDateString()}</p>
                    <p><strong>Inicio:</strong> {new Date(permisoItem.fechaInicio).toLocaleDateString()}</p>
                    <p><strong>Término:</strong> {permisoItem.fechaTermino ? new Date(permisoItem.fechaTermino).toLocaleDateString() : "No especificada"}</p>
                    <p><strong>Días:</strong> {permisoItem.nDias}</p>
                  </div>
                ))
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No hay permisos</p>
          )}
          <button
            onClick={() => setShowPermissionsPopup(false)}
            className="mt-6 w-full p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >Cerrar</button>
        </div>
      </div>
    )}

    {showtraining && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
          <h3 className="text-xl font-bold mb-4 text-center">Capacitaciones del Funcionario</h3>
          {training.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {training.map((capacitacion, index) => (
                <div key={index} className="border p-4 rounded-lg shadow-md bg-gray-100">
                  <p><strong>Nombre:</strong> {capacitacion.nombreCapacitacion}</p>
                  <p><strong>Horas:</strong> {capacitacion.horasRealizadas}</p>
                  <p><strong>Nota:</strong> {capacitacion.nota}</p>
                  <p><strong>Peso:</strong> {capacitacion.PesoRelativo}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No hay capacitaciones</p>
          )}
          <button
            onClick={() => setShowtraining(false)}
            className="mt-6 w-full p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >Cerrar</button>
        </div>
      </div>
    )}
  </div>
);
};

export default ShowWorkers;
