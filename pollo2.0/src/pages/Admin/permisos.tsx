import { useState } from "react";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const AgregarPermiso = () => {
    const [rut, setRut] = useState("");
    const [estado, setEstado] = useState("");
    const [tipoPermiso, setTipoPermiso] = useState("");
    const [fechaSolicitud, setFechaSolicitud] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaTermino, setFechaTermino] = useState("");
    const [nDias, setNDias] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const rutadmin = localStorage.getItem("rut");

    const handleTipoPermiso = (tipo: string) => {
        setTipoPermiso(tipo);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
    
        const permisoData = { 
            rut, 
            rutadmin, 
            estado, 
            tipoPermiso, 
            fechaSolicitud, 
            fechaInicio, 
            fechaTermino, 
            nDias 
        };
    
        try {
            const response = await fetch(`${API_URL}/permisos/agregar/${rut}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(permisoData),
            });
    
            if (!response.ok) {
                throw new Error("Error al agregar el permiso. Permisos no autorizados");
            }
    
            if (tipoPermiso === "Día Administrativo") {
                await fetch("http://localhost:3001/users/deduct-administrative-days", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ rut, daysToDeduct: nDias }),
                });
            } else if (tipoPermiso === "Feriado Legal") {
                await fetch("http://localhost:3001/users/deduct-holiday", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ rut, daysToDeduct: nDias }),
                });
            } else if (tipoPermiso === "Horas Compensatorias") {
                await fetch("http://localhost:3001/users/add-compensatory-hours", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ rut, hoursToAdd: nDias }),
                });
            }
    
            alert("Permiso agregado correctamente");
            setRut("");
            setEstado("");
            setTipoPermiso("");
            setFechaSolicitud("");
            setFechaInicio("");
            setFechaTermino("");
            setNDias(0);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen  bg-gradient-to-r from-black via-gray-600 to-blue-2000">
            <div className="w-full max-w-lg h-[70vh] bg-white p-6 rounded-xl shadow-lg border border-gray-300 flex flex-col justify-center">
                <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Agregar Permiso</h2>
                {error && <p className="text-red-600 text-center mb-3 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-gray-700 text-sm mb-1">RUT</label>
                            <input
                                type="text"
                                value={rut}
                                onChange={(e) => setRut(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm mb-1">Estado</label>
                            <input
                                type="text"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-700 text-sm mb-1">Tipo de Permiso</p>
                        <div className="grid grid-cols-3 gap-1">
                            {["Día Adm.", "Feriado", "Horas Comp."].map((tipo) => (
                                <button
                                    key={tipo}
                                    type="button"
                                    onClick={() => handleTipoPermiso(tipo)}
                                    className={`text-xs p-2 rounded-md transition duration-200 border ${
                                        tipoPermiso === tipo
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                >
                                    {tipo}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="block text-gray-700 text-xs mb-1">Inicio</label>
                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-xs mb-1">Término</label>
                            <input
                                type="date"
                                value={fechaTermino}
                                onChange={(e) => setFechaTermino(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-xs mb-1">Solicitud</label>
                            <input
                                type="date"
                                value={fechaSolicitud}
                                onChange={(e) => setFechaSolicitud(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm mb-1">Número de días</label>
                        <input
                            type="number"
                            value={nDias}
                            onChange={(e) => setNDias(Number(e.target.value))}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className={`w-full py-2 text-white text-sm font-semibold rounded-md ${
                                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Agregar Permiso"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
    
    
};

export default AgregarPermiso;
