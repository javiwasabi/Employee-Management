import { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

interface User {
  rut: string;
  apellidos: string;
  nombres: string;
  tipoContrato: string;
  cargo: string;
  feriadoLegal: number | "";
  diasAdministrativos: number | "";
  horasCompensatorias?: number | "";
  password: string;
}

export default function CreateUsers() {
  const [users, setUsers] = useState<User[]>([
    {
      rut: "",
      apellidos: "",
      nombres: "",
      tipoContrato: "",
      cargo: "",
      feriadoLegal: "",
      diasAdministrativos: "",
      horasCompensatorias: "",
      password: "",
    },
  ]);
  const [message, setMessage] = useState<string | null>(null);
  const [deleteRut, setDeleteRut] = useState<string>("");

  // Manejar cambios en los inputs
  const handleChange = (index: number, field: keyof User, value: string | number) => {
    const newUsers = [...users];
    newUsers[index][field] = value as never;
    setUsers(newUsers);
  };

  // Guardar usuarios en el backend
  const handleSaveUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(users),
      });

      if (!response.ok) throw new Error("Error al guardar los usuarios");

      setMessage("Usuarios guardados correctamente");
      setUsers([
        {
          rut: "",
          apellidos: "",
          nombres: "",
          tipoContrato: "",
          cargo: "",
          feriadoLegal: "",
          diasAdministrativos: "",
          horasCompensatorias: "",
          password: "",
        },
      ]);
    } catch (error) {
      setMessage("Error al guardar los usuarios");
    }
  };

  // Eliminar usuario por RUT
  const handleDeleteUser = async () => {
    if (!deleteRut.trim()) {
      setMessage("Ingrese un RUT para eliminar");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruts: [deleteRut] }),
      });

      if (!response.ok) throw new Error("No se pudo eliminar el usuario");

      setMessage(`Usuario con RUT ${deleteRut} eliminado correctamente`);
      setDeleteRut("");
    } catch (error) {
      setMessage("Error al eliminar el usuario");
    }
  };

  return (
    <div className="relative bg-blue min-h-screen flex items-center justify-center overflow-hidden p-4">
      {/* Fondo */}
      <img src="/fondo.png" alt="Background" className="absolute inset-0 h-full w-full object-cover opacity-80" />

      {/* Contenido */}
      <div className="relative bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-center mb-4">Gestión de Usuarios</h2>

        {/* Formulario de Usuarios */}
        <div className="space-y-4">
          {users.map((user, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <h3 className="font-semibold mb-2">Usuario {index + 1}</h3>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="RUT" value={user.rut} onChange={(e) => handleChange(index, "rut", e.target.value)} className="border p-2 w-full" />
                <input type="text" placeholder="Apellidos" value={user.apellidos} onChange={(e) => handleChange(index, "apellidos", e.target.value)} className="border p-2 w-full" />
                <input type="text" placeholder="Nombres" value={user.nombres} onChange={(e) => handleChange(index, "nombres", e.target.value)} className="border p-2 w-full" />
                <input type="text" placeholder="Tipo de Contrato" value={user.tipoContrato} onChange={(e) => handleChange(index, "tipoContrato", e.target.value)} className="border p-2 w-full" />
                <input type="text" placeholder="Cargo" value={user.cargo} onChange={(e) => handleChange(index, "cargo", e.target.value)} className="border p-2 w-full" />
                
                {/* Campos con placeholders explicativos */}
                <input
                  type="number"
                  placeholder="Feriados legales"
                  value={user.feriadoLegal}
                  onChange={(e) => handleChange(index, "feriadoLegal", e.target.value ? Number(e.target.value) : "")}
                  className="border p-2 w-full"
                />
                <input
                  type="number"
                  placeholder="Días administrativos "
                  value={user.diasAdministrativos}
                  onChange={(e) => handleChange(index, "diasAdministrativos", e.target.value ? Number(e.target.value) : "")}
                  className="border p-2 w-full"
                />
                <input
                  type="number"
                  placeholder="Horas compensatorias"
                  value={user.horasCompensatorias}
                  onChange={(e) => handleChange(index, "horasCompensatorias", e.target.value ? Number(e.target.value) : "")}
                  className="border p-2 w-full"
                />

               
                <input type="password" placeholder="Contraseña" value={user.password} onChange={(e) => handleChange(index, "password", e.target.value)} className="border p-2 w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Botón de Guardar */}
        <button onClick={handleSaveUsers} className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Guardar Usuarios
        </button>

        {/* Sección de Eliminar Usuario */}
        <div className="mt-6 p-4 border rounded-lg shadow-sm bg-gray-50">
          <h3 className="font-semibold text-center mb-2">Eliminar Usuario</h3>
          <input
            type="text"
            placeholder="Ingrese el RUT a eliminar"
            value={deleteRut}
            onChange={(e) => setDeleteRut(e.target.value)}
            className="border p-2 w-full"
          />
          <button onClick={handleDeleteUser} className="mt-2 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">
            Eliminar Usuario
          </button>
        </div>

        {/* Mensajes */}
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}
