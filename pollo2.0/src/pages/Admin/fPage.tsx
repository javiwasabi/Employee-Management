import React, { useState } from "react";
import { ButtonStartp, ButtonNext} from "../../components/buttons";
import "../../styles/background.css";
import { useNavigate } from "react-router-dom";
const First: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const userLanguage = navigator.language || navigator.languages[0];
  const isSpanish = userLanguage.startsWith("es");
  const navigate = useNavigate();

  const handleClick = () => {
    setIsRevealed(!isRevealed);
  };

  return (
    <div className="relative bg-blue min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src="fondo.png"
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />
  
      <div className="flex flex-col items-center gap-6">
        {/* Primera fila: Cards 1 y 2 */}
        <div className="flex gap-4">
          {/* Card 1 */}
          <div className="w-60 p-4 bg-white rounded-xl transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl">
            <div className="p-2">
              <h2 className="font-bold text-lg mb-2">Revisar disponibilidad</h2>
              <p className="text-sm text-gray-600">
                Revisa los días que se encuentran con permisos
              </p>
            </div>
            <div className="m-2">
              <ButtonNext id="next-button" onClick={() => navigate("/admin/calendario")} />
            </div>
          </div>
  
          {/* Card 2 */}
          <div className="w-60 p-4 bg-white rounded-xl transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl">
            <div className="p-2">
              <h2 className="font-bold text-lg mb-2">Registrar permiso</h2>
              <p className="text-sm text-gray-600">
                Registra directamente un permiso autorizado
              </p>
            </div>
            <div className="m-2">
              <ButtonNext id="next-button" onClick={() => navigate("/admin/permisos")} />
            </div>
          </div>
        </div>
        <div className="flex gap-4">
        {/* Segunda fila: Card 3 */}
        <div className="w-60 p-4 bg-white rounded-xl transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl">
          <div className="p-2">
            <h2 className="font-bold text-lg mb-2">Registrar capacitaciones</h2>
            <p className="text-sm text-gray-600">
              Incorpora las capacitaciones con sus respectivos datos.
            </p>
          </div>
          <div className="m-2">
            <ButtonNext id="next-button" onClick={() => navigate("/admin/capacitaciones")} />
          </div>
          </div>
          {/* Segunda fila: Card 3 */}
        <div className="w-60 p-4 bg-white rounded-xl transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl">
          <div className="p-2">
            <h2 className="font-bold text-lg mb-2">Visualizar funcionarios</h2>
            <p className="text-sm text-gray-600">
              Revisa cada ficha de los funcionarios.
            </p>
          </div>
          <div className="m-2">
            <ButtonNext id="next-button" onClick={() => navigate("/admin/usuarios")} />
          </div>

        </div>
        <div className="w-60 p-4 bg-white rounded-xl transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl">
          <div className="p-2">
            <h2 className="font-bold text-lg mb-2">Modificar permisos</h2>
            <p className="text-sm text-gray-600">
              modifica los permisos de los usuarios.
            </p>
          </div>
          <div className="m-2">
            <ButtonNext id="next-button" onClick={() => navigate("/admin/updatePermisos")} />
          </div>

        </div>
        
        </div>
      </div>
    </div>
  );
  
};

export default First;
