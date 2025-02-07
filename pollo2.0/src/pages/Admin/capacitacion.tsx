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
            const response = await fetch(`gallant-stillness-production.up.railway.app/capacitaciones/agregar/${rut}`, {
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r bg-gradient-to-r from-black via-gray-600 to-blue-200">
            <div className="w-full max-w-md h-[60vh] bg-white p-6 rounded-xl shadow-lg border border-gray-300 flex flex-col justify-center">
                <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Agregar Capacitación</h2>
                {error && <p className="text-red-600 text-center mb-3 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm mb-1">RUT del usuario</label>
                        <input
                            type="text"
                            value={rut}
                            onChange={(e) => setRut(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm mb-1">Nombre de la Capacitación</label>
                        <input
                            type="text"
                            value={nombreCapacitacion}
                            onChange={(e) => setNombreCapacitacion(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-gray-700 text-sm mb-1">Horas Realizadas</label>
                            <input
                                type="number"
                                value={horasRealizadas}
                                onChange={(e) => setHorasRealizadas(Number(e.target.value))}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm mb-1">Nota</label>
                            <input
                                type="number"
                                value={nota}
                                onChange={(e) => setNota(Number(e.target.value))}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm mb-1">Peso Relativo</label>
                        <input
                            type="text"
                            value={pesoRelativo}
                            onChange={(e) => setPesoRelativo(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className={`w-full py-2 text-white text-sm font-semibold rounded-md ${
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
