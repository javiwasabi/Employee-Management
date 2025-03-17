import React, { useState, useEffect } from "react";
import Calendar from "../../components/calendar";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const ITEMS_PER_PAGE = 5;

interface Permiso {
  rut: string;
  tipoPermiso: string;
  estado: string;
  fechaInicio: string;
  fechaTermino: string;
}

interface Capacitacion {
  rut: string;
  nombreCapacitacion: string;
  horasRealizadas: number;
}

interface Usuario {
  rut: string;
  nombres: string;
  apellidos: string;
}

const Last: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      const resPermisos = await axios.get(`${API_URL}/permisos/listar`);
      const resCapacitaciones = await axios.get(`${API_URL}/capacitaciones/listar/capacitaciones`);
      const resUsuarios = await axios.get(`${API_URL}/users`);
      
      const permisosFiltrados = resPermisos.data.flatMap((p: any) =>
        p.permisos.filter((permiso: Permiso) =>
          isDateInRange(selectedDate!, permiso.fechaInicio, permiso.fechaTermino)
        ).map((permiso: Permiso) => ({ ...permiso, rut: p.rut }))
      );
      
      const capacitacionesFiltradas = resCapacitaciones.data.flatMap((c: any) =>
        c.capacitaciones.filter((capacitacion: Capacitacion) => capacitacion.rut)
      );
      
      const usuariosFiltrados = resUsuarios.data.users.filter((usuario: Usuario) =>
        permisosFiltrados.some((permiso: any) => permiso.rut === usuario.rut) ||
        capacitacionesFiltradas.some((capacitacion: any) => capacitacion.rut === usuario.rut)
      );
      
      setPermisos(permisosFiltrados);
      setCapacitaciones(capacitacionesFiltradas);
      setUsuarios(usuariosFiltrados);
      setCurrentPage(0);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const isDateInRange = (date: Date, start: string, end: string) => {
    const d = new Date(date).toISOString().split("T")[0];
    return d >= start && d <= end;
  };

  const paginatedItems = [...permisos, ...capacitaciones].slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-gray-600 to-white flex items-center justify-center">
      <div className="w-[60%] h-[70vh] p-4 bg-white rounded-lg shadow-lg">
        <Calendar onClickDay={setSelectedDate} />
      </div>

      {selectedDate && (
        <div className="absolute w-[90%] max-w-md p-6 bg-white rounded-xl shadow-2xl flex flex-col items-center">
          <h3 className="font-bold text-lg text-center">Registros del {selectedDate.toDateString()}</h3>
          <ul className="mt-2 text-center">
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item, index) => (
                <li key={index} className="text-sm text-black">
                  {"tipoPermiso" in item ? (
                    `${usuarios.find(u => u.rut === item.rut)?.nombres} ${usuarios.find(u => u.rut === item.rut)?.apellidos} - Permiso: ${item.tipoPermiso} (${item.estado})`
                  ) : (
                    `${usuarios.find(u => u.rut === item.rut)?.nombres} ${usuarios.find(u => u.rut === item.rut)?.apellidos} - Capacitación: ${item.nombreCapacitacion} (${item.horasRealizadas} horas)`
                  )}
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-600">No hay registros este día</li>
            )}
          </ul>
          {paginatedItems.length > 0 && (
            <div className="flex justify-between w-full mt-4">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg shadow hover:bg-gray-400 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                disabled={(currentPage + 1) * ITEMS_PER_PAGE >= permisos.length + capacitaciones.length}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg shadow hover:bg-gray-400 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
          <button
            onClick={() => setSelectedDate(null)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default Last;
