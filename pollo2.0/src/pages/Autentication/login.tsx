import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Login = () => {
  const [formData, setFormData] = useState({ rut: "", password: "" });
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 

    console.log("Datos enviados:", formData);

    try {
        const res = await axios.post("http://localhost:3001/auth/login", formData);

        console.log("Respuesta del backend:", res.data);
        console.log("Está el rol?", res.data.role);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("rut", res.data.rut) 
      
        if (res.data.role === "admin") {
          navigate("/"); 
           
        } else if (res.data.role === "usuario") {
          navigate("/usuario"); 
        } else {
          setError("No tienes acceso autorizado");
        }

    } catch (error) {
        console.error("Error en la autenticación:", error);
        setError("Rut o contraseña incorrectos");
    }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-600 to-white">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Iniciar sesión</h2>

        {error && <p className="mt-2 text-sm text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6">
          {/* Campo Rut */}
          <div>
            <label className="block text-sm font-medium text-gray-700">RUT</label>
            <input
              type="text"
              name="rut"
              placeholder="Ingrese su RUT"
              value={formData.rut}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Ingrese su contraseña"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              required
            />
          </div>


          <button
            type="submit"
            className="mt-6 w-full py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
          >
            Iniciar sesión
          </button>
        </form>

      </div>
    </div>
  );
};
