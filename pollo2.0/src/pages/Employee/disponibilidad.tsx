import React, { useState, useEffect } from "react";
import Calendar from "../../components/calendar";
import axios from "axios";

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

const CalendarLanding: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);
  

  const fetchData = async () => {
    try {
      const resPermisos = await axios.get(`http://localhost:3001/permisos/listar`);
      const resUsuarios = await axios.get(`http://localhost:3001/users`);
      console.log(resUsuarios.data.users)
      
      const permisosFiltrados = resPermisos.data.flatMap((p: any) =>
        p.permisos.filter((permiso: Permiso) =>
          isDateInRange(selectedDate!, permiso.fechaInicio, permiso.fechaTermino)
        ).map((permiso: Permiso) => ({ ...permiso, rut: p.rut }))
      );
      
      const usuariosFiltrados = resUsuarios.data.users.filter((usuario: Usuario) =>
        permisosFiltrados.some((permiso : any) => permiso.rut === usuario.rut)
      );
      
      setPermisos(permisosFiltrados);
      setUsuarios(usuariosFiltrados);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const isDateInRange = (date: Date, start: string, end: string) => {
    const d = new Date(date).toISOString().split("T")[0];
    return d >= start && d <= end;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-gray-600 to-white flex items-center justify-center">
      {/* Calendario */}
      <div className="w-[60%] h-[70vh] p-4 bg-white rounded-lg shadow-lg">
        <Calendar onClickDay={setSelectedDate} />
      </div>

      {/* Card de información */}
      {selectedDate && (
        <div className="absolute w-[90%] max-w-md p-6 bg-white rounded-xl shadow-2xl flex flex-col items-center">
          <h3 className="font-bold text-lg text-center">Registros del {selectedDate.toDateString()}</h3>
          <ul className="mt-2 text-center">
            {permisos.length > 0 ? (
              permisos.map((p, index) => (
                <li key={index} className="text-sm text-black">
                  {usuarios.find(u => u.rut === p.rut)?.nombres} {usuarios.find(u => u.rut === p.rut)?.apellidos} - Permiso: {p.tipoPermiso} ({p.estado})
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-600">No hay permisos este día</li>
            )}
          </ul>
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

export default CalendarLanding;