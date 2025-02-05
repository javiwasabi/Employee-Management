import { useState } from "react";

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const permisoData = { estado, tipoPermiso, fechaSolicitud, fechaInicio, fechaTermino, nDias };

        try {
            const response = await fetch(`http://localhost:3001/permisos/agregar/${rut}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(permisoData),
            });

            if (!response.ok) {
                throw new Error("Error al agregar el permiso");
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-600 to-white">
            <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg border border-gray-300">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Agregar Permiso</h2>
                {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            placeholder="RUT del usuario"
                            value={rut}
                            onChange={(e) => setRut(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Estado"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Tipo de Permiso"
                            value={tipoPermiso}
                            onChange={(e) => setTipoPermiso(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <input
                                type="date"
                                value={fechaSolicitud}
                                onChange={(e) => setFechaSolicitud(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>
                        <div className="w-1/2">
                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>
                    </div>
                    <div>
                        <input
                            type="date"
                            value={fechaTermino}
                            onChange={(e) => setFechaTermino(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="Número de días"
                            value={nDias}
                            onChange={(e) => setNDias(Number(e.target.value))}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className={`w-full py-3 text-white font-semibold rounded-lg ${
                                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            } transition duration-200`}
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
