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

    try {
      const res = await axios.post("gallant-stillness-production.up.railway.app/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("rut", res.data.rut);

      if (res.data.role === "admin") {
        navigate("/"); 
      } else if (res.data.role === "usuario") {
        navigate("/usuario"); 
      } else {
        setError("No tienes acceso autorizado");
      }
    } catch (error) {
      setError("Rut o contraseña incorrectos");
    }
  };

  return (
    <div className="relative bg-blue min-h-screen flex items-center justify-center overflow-hidden">
    <img
      src="fondo.png"
      alt="Background"
      className="absolute inset-0 h-full w-full object-cover opacity-80 z-0"
    />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 z-10">
        <h2 className="text-2xl font-bold text-center text-gray-800">Iniciar sesión</h2>
        {error && <p className="mt-2 text-sm text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">RUT</label>
            <input
              type="text"
              name="rut"
              placeholder="Ej: 12345-6"
              value={formData.rut}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 shadow-sm"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Ingrese su contraseña"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 shadow-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-6 w-full py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300 hover:bg-green-600 focus:ring-2 focus:ring-green-400"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};
