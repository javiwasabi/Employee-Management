import { useState } from "react";

const AgregarCapacitacion = () => {
    const [rut, setRut] = useState("");
    const [nombreCapacitacion, setNombreCapacitacion] = useState("");
    const [horasRealizadas, setHorasRealizadas] = useState(0);
    const [nota, setNota] = useState(0);
    const [pesoRelativo, setPesoRelativo] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const capacitacionData = { nombreCapacitacion, horasRealizadas, nota, PesoRelativo: pesoRelativo };

        try {
            const response = await fetch(`http://localhost:3001/capacitaciones/agregar/${rut}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(capacitacionData),
            });

            if (!response.ok) {
                throw new Error("Error al agregar la capacitación");
            }

            alert("Capacitación agregada correctamente");
            setRut("");
            setNombreCapacitacion("");
            setHorasRealizadas(0);
            setNota(0);
            setPesoRelativo("");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-600 to-white">
            <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg border border-gray-300">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Agregar Capacitación</h2>
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
                            placeholder="Nombre de la Capacitación"
                            value={nombreCapacitacion}
                            onChange={(e) => setNombreCapacitacion(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="Horas Realizadas"
                            value={horasRealizadas}
                            onChange={(e) => setHorasRealizadas(Number(e.target.value))}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="Nota"
                            value={nota}
                            onChange={(e) => setNota(Number(e.target.value))}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Peso Relativo"
                            value={pesoRelativo}
                            onChange={(e) => setPesoRelativo(e.target.value)}
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
                            {loading ? "Guardando..." : "Agregar Capacitación"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgregarCapacitacion;
