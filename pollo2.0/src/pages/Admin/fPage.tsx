import React, { useState } from "react";
import { ButtonNext } from "../../components/buttons";
import "../../styles/background.css";
import { useNavigate } from "react-router-dom";

const First: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative bg-blue min-h-screen flex items-center justify-center overflow-hidden p-4">
      {/* Fondo */}
      <img
        src="fondo.png"
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />

      {/* Contenedor de las tarjetas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 z-10">
        {/* Tarjeta 1 */}
        <Card
          title="Revisar disponibilidad"
          description="Revisa los días que se encuentran con permisos"
          onClick={() => navigate("/admin/calendario")}
        />

        {/* Tarjeta 2 */}
        <Card
          title="Registrar permiso"
          description="Registra directamente un permiso autorizado"
          onClick={() => navigate("/admin/permisos")}
        />

        {/* Tarjeta 3 */}
        <Card
          title="Registrar capacitaciones"
          description="Incorpora las capacitaciones con sus respectivos datos."
          onClick={() => navigate("/admin/capacitaciones")}
        />

        {/* Tarjeta 4 */}
        <Card
          title="Visualizar funcionarios"
          description="Revisa cada ficha de los funcionarios."
          onClick={() => navigate("/admin/usuarios")}
        />

        {/* Tarjeta 5 */}
        <Card
          title="Modificar Permisos y Capacitaciones"
          description="Modifica los permisos de los usuarios."
          onClick={() => navigate("/admin/updatePermisos")}
        />
      </div>
    </div>
  );
};

// Componente reutilizable para tarjetas
const Card: React.FC<{ title: string; description: string; onClick: () => void }> = ({
  title,
  description,
  onClick,
}) => {
  return (
    <div className="w-full md:w-60 p-4 bg-white rounded-xl transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl">
      <div className="p-2">
        <h2 className="font-bold text-lg mb-2">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="m-2">
        <ButtonNext id="next-button" onClick={onClick} />
      </div>
    </div>
  );
};

export default First;
