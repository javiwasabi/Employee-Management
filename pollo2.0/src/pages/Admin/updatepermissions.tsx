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
    const [users, setUsers] = useState<{ nombres: string; apellidos:string; rut: string }[]>([]);
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

    const handleEliminarCapacitacion = async (capacitacionItem: any) => {
      const { _id: capacitacionId, nombreCapacitacion, horasRealizadas, nota, PesoRelativo } = capacitacionItem;
    
      try {
        const response = await fetch(`${API_URL}/capacitaciones/eliminar/${rutmodi}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ capacitacionId, rutAdmin, rutmodi, nombreCapacitacion, horasRealizadas, nota, PesoRelativo })
        });
    
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          if (response.ok) {
            alert("Capacitación eliminada correctamente");
            setTraining((prev) => prev.filter((c) => c._id !== capacitacionId));
            window.location.reload();
          } else {
            alert(data.message || "Error al eliminar la capacitación");
          }
        } catch (jsonError) {
          console.error("Respuesta inesperada:", text);
          alert("Error inesperado en el servidor.");
        }
      } catch (error) {
        console.error("Error al eliminar la capacitación:", error);
        alert("No se pudo conectar con el servidor.");
      }
    };

    const handleHoliday = async (feriadosAdd: number, rut: string) => {
      try {
          const response = await fetch(`${API_URL}/users/deduct-holiday`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ rut, daysToDeduct: feriadosAdd })
          });
  
          const text = await response.text();
          try {
              const data = JSON.parse(text);
              if (response.ok) {
                  alert("Feriado legal modificado correctamente");
              } else {
                  alert(data.message || "Error al modificar los días de feriado");
              }
          } catch {
              console.error("Respuesta inesperada:", text);
              alert("Error inesperado en el servidor.");
          }
      } catch (error) {
          console.error("Error al modificar el feriado:", error);
          alert("No se pudo conectar con el servidor.");
      }
  };
  
  const handleAdminDays = async (admDayAdd: number, rut: string) => {
      try {
          const response = await fetch(`${API_URL}/users/deduct-administrative-days`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ rut, daysToDeduct: admDayAdd })
          });
  
          const text = await response.text();
          try {
              const data = JSON.parse(text);
              if (response.ok) {
                  alert("Días administrativos modificados correctamente");
              } else {
                  alert(data.message || "Error al modificar los días administrativos");
              }
          } catch {
              console.error("Respuesta inesperada:", text);
              alert("Error inesperado en el servidor.");
          }
      } catch (error) {
          console.error("Error al modificar días administrativos:", error);
          alert("No se pudo conectar con el servidor.");
      }
  };

  const handleCompensatory = async (Hours: number, rut: string) => {
    try {
        const response = await fetch(`${API_URL}/users/add-compensatory-hours`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rut, hoursToAdd: Hours})
        });

        const text = await response.text();
        try {
            const data = JSON.parse(text);
            if (response.ok) {
                alert("Horas compensatorias modificadas correctamente!");
            } else {
                alert(data.message || "Error al modificar las horas compensatorias");
            }
        } catch {
            console.error("Respuesta inesperada:", text);
            alert("Error inesperado en el servidor.");
        }
    } catch (error) {
        console.error("Error al modificar las horas:", error);
        alert("No se pudo conectar con el servidor.");
    }
};
const handlemodificarPermiso= async (permisoItem: any) => {
  const { _id: capacitacionId, nombreCapacitacion, horasRealizadas, nota, PesoRelativo } = permisoItem;

  try {
    const response = await fetch(`${API_URL}/permisos/modificar-permiso/${rutmodi}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ capacitacionId, rutAdmin, rutmodi, nombreCapacitacion, horasRealizadas, nota, PesoRelativo })
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      if (response.ok) {
        alert("Permiso corregido correctamente");
        setTraining((prev) => prev.filter((c) => c._id !== capacitacionId));
        window.location.reload();
      } else {
        alert(data.message || "Error al modificar permiso");
      }
    } catch (jsonError) {
      console.error("Respuesta inesperada:", text);
      alert("Error inesperado en el servidor.");
    }
  } catch (error) {
    console.error("Error al modificar :", error);
    alert("No se pudo conectar con el servidor.");
  }
};


  const [feriadosLegales, setFeriadosLegales] = useState(0);
  const [diasAdministrativos, setDiasAdministrativos] = useState(0);
  const [horasCompensatorias, setHorasCompensatorias] = useState(0);

  useEffect(() => {
    if (selectedWorker?.user) {
      setFeriadosLegales(selectedWorker.user.feriadoLegal || 0);
      setDiasAdministrativos(selectedWorker.user.diasAdministrativos || 0);
      setHorasCompensatorias(selectedWorker.user.horasCompensatorias || 0);
    }
  }, [selectedWorker]);

    
  
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
              {user.nombres} {user.apellidos} - {user.rut}
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

      {/* Mejora de diseño para secciones con botones */}
      {[
        { label: "Feriados Legales", value: feriadosLegales, setValue: setFeriadosLegales, handler: handleHoliday },
        { label: "Días Administrativos", value: diasAdministrativos, setValue: setDiasAdministrativos, handler: handleAdminDays },
        { label: "Horas Compensatorias", value: horasCompensatorias, setValue: setHorasCompensatorias, handler: handleCompensatory },
      ].map(({ label, value, setValue, handler }, index) => (
        <div key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg mt-2">
          <span className="font-medium">{label}: {value}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setValue(prev => prev + 1)} className="p-1 bg-gray-200 hover:bg-gray-300 rounded">▲</button>
            <button onClick={() => setValue(prev => Math.max(prev - 1, 0))} className="p-1 bg-gray-200 hover:bg-gray-300 rounded">▼</button>
            {handler && (
              <button onClick={() => handler(value, selectedWorker?.user.rut)} className="p-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                Guardar
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Botones de acciones */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          onClick={() => setShowPermissionsPopup(true)}
          className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          Ver Permisos
        </button>
        <button
          onClick={() => setShowtraining(true)}
          className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          Ver Capacitaciones
        </button>
        <button
          onClick={() => setSelectedWorker(null)}
          className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 col-span-1 sm:col-span-2"
        >
          Cerrar
        </button>
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Nombre</th>
                <th className="px-4 py-2 border">Horas</th>
                <th className="px-4 py-2 border">Nota</th>
                <th className="px-4 py-2 border">Peso</th>
                <th className="px-4 py-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {training.map((capacitacion) => (
                <tr key={capacitacion._id} className="text-center border">
                  <td className="px-4 py-2 border">{capacitacion.nombreCapacitacion}</td>
                  <td className="px-4 py-2 border">{capacitacion.horasRealizadas}</td>
                  <td className="px-4 py-2 border">{capacitacion.nota}</td>
                  <td className="px-4 py-2 border">{capacitacion.PesoRelativo}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleEliminarCapacitacion(capacitacion)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No hay capacitaciones</p>
      )}
      <button
        onClick={() => setShowtraining(false)}
        className="mt-6 w-full p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
      >
        Cerrar
      </button>
    </div>
  </div>
)}

  </div>
);
};

export default UpdatePermissions;
