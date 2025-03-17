import React, { useState, useEffect } from "react"; 
import axios from "axios"; 
import { format, toZonedTime } from "date-fns-tz";
import { addHours, parseISO } from "date-fns";

const formatDate = (isoDate: string) => {
  const timeZone = "America/Santiago"; // Zona horaria de Chile
  const dateWithOffset = addHours(parseISO(isoDate), 12); // Asegurar que sea mediodía en UTC
  const zonedDate = toZonedTime(dateWithOffset, timeZone);
  return format(zonedDate, "dd/MM/yyyy");
};


const ITEMS_PER_PAGE = 6;

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const UpdatePermissions: React.FC = () => {
    const [searchRut, setSearchRut] = useState(""); 
    const [selectedWorker, setSelectedWorker] = useState<any | null>(null); 
    const [permissions, setPermissions] = useState<any[]>([]); 
    const [showPermissionsPopup, setShowPermissionsPopup] = useState(false);
    const [training, setTraining] = useState<any[]>([]); 
    const [showtraining, setShowtraining] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchLetter, setSearchLetter] = useState("");
    const [users, setUsers] = useState<{ nombres: string; rut: string }[]>([]);
    const [rutmodi, setRutmodi] = useState("");

    const rutAdmin = localStorage.getItem("rut");
  
    const fetchWorkerByRut = async (rut: string) => {
      if (rut.trim().length === 0) {
        setSelectedWorker(null);
        return;
      }
  
      try {
        const response = await axios.get(`${API_URL}/users/${rut}`);
        console.log("Datos del trabajador:", response.data); 
        setSelectedWorker(response.data);
        setRutmodi(response.data.user.rut);
        console.log("ESTE ES EL RUT A MODIFICAR: ", rutmodi)
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
      const fetchUsersByLetter = async () => {
        if (!searchLetter) return;
  
        setLoading(true);
        setError("");
        try {
          const response = await fetch(`${API_URL}/users/buscar-inicial?letter=${searchLetter}`);
          console.log("Respuesta del servidor:", response); 
          const data = await response.json();
  
          if (!response.ok) throw new Error(data.message || "Error al obtener datos");
          
          setUsers(data.users);
        }catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Ocurrió un error desconocido");
          }      
        } finally {
          setLoading(false);
        }
      };
  
      fetchUsersByLetter();
    }, [searchLetter]);
  
  
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

 
    const handleDeletePermission = async (permisoItem: any) => {
      
      const { tipoPermiso, nDias, _id: permisoId } = permisoItem; 
    
      try {
        const response = await fetch(`${API_URL}/permisos/eliminar-permiso/${rutmodi}`, { 
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ permisoId, rutAdmin, rutmodi, tipoPermiso, nDias }) // ✅ Solo enviar los datos necesarios
        });
    
        const text = await response.text(); 
        try {
          const data = JSON.parse(text);
          if (response.ok) {
            alert("Permiso eliminado correctamente");
            setPermissions((prev) => prev.filter((p) => p._id !== permisoId));
            window.location.reload();

          } else {
            alert(data.message || "Error al eliminar el permiso");
          }
        } catch (jsonError) {
          console.error("Respuesta inesperada:", text);
          alert("Error inesperado en el servidor.");
        }
      } catch (error) {
        console.error("Error al eliminar el permiso:", error);
        alert("No se pudo conectar con el servidor.");
      }
    };
    
    
      
  
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
       {/* Texto "Buscar por nombre" */}
  <p className="text-white text-lg font-semibold mt-4">Buscar por nombre</p>

{/* Bloque de letras con diseño elegante */}
<div className="mt-2 grid grid-cols-7 gap-2">
  {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
    <button
      key={letter}
      className={`p-3 text-lg font-semibold text-white rounded-md transition-all duration-300 
      ${searchLetter === letter ? "bg-white text-black shadow-md" : "bg-white/20 border border-white/50 hover:bg-white/30 focus:bg-white/40"}`}
      onClick={() => {
        setSearchLetter(letter);
        setSearchRut(""); // Resetea la búsqueda por RUT
      }}
    >
      {letter}
    </button>
  ))}
</div>


      {/* Mensajes de carga y error */}
      {loading && <p className="text-white mt-4">Cargando...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Lista de resultados */}
      <ul className="mt-4 text-white">
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.rut} className="p-2 border-b border-white/50">
              {user.nombres} - {user.rut}
            </li>
          ))
        ) : (
          !loading && <li className="p-2 text-gray-300">No se encontraron resultados</li>
        )}
      </ul>
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Tipo</th>
                <th className="border px-4 py-2">Estado</th>
                <th className="border px-4 py-2">Solicitud</th>
                <th className="border px-4 py-2">Inicio</th>
                <th className="border px-4 py-2">Término</th>
                <th className="border px-4 py-2">Días</th>
                <th className="border px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {permissions.flatMap((permiso, index) =>
                permiso.permisos.map((permisoItem: any, subIndex: any) => (
                  <tr key={`${index}-${subIndex}`} className="border">
                    <td className="border px-4 py-2">{permisoItem.tipoPermiso}</td>
                    <td className="border px-4 py-2">{permisoItem.estado}</td>
                    <td className="border px-4 py-2">{formatDate(permisoItem.fechaSolicitud)}</td>
                    <td className="border px-4 py-2">{formatDate(permisoItem.fechaInicio)}</td>
                    <td className="border px-4 py-2">{permisoItem.fechaTermino ? formatDate(permisoItem.fechaTermino) : "No especificada"}</td>
                    <td className="border px-4 py-2">{permisoItem.nDias}</td>
                    <td className="border px-4 py-2">
                      <button 
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDeletePermission(permisoItem)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No hay permisos</p>
      )}

      <button
        onClick={() => setShowPermissionsPopup(false)}
        className="mt-6 w-full p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
      >
        Cerrar
      </button>
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

export default UpdatePermissions;
