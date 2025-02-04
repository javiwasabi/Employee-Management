import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export const ButtonStart: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[10%] w-full font-title">
      <Link to="/question">
        <button
          className="relative -top-1 -left-1 bg-gray-800 py-10 px-8 sm:py-20 sm:px-10 font-medium uppercase text-white text-3xl sm:text-2xl bg-transparent"
          style={{ transform: "rotate(0deg)" }}
        >
          START
        </button>
      </Link>
    </div>
  );
};

interface ButtonNextProps {
  onClick?: () => void;
  id?: string; 
}

export const ButtonNext: React.FC<ButtonNextProps> = ({ onClick, id }) => {
  return (
    <div >
      <button
        id={id} 
      
        onClick={onClick}
      >

        <span className="text-white bg-purple-600 px-3 py-1 rounded-md hover:bg-purple-700">Continuar</span>
      </button>
    </div>
  );
};


export const Choice: React.FC<{ 
  onClick: () => void; 
  id: string; 
  disabled: boolean; 
}> = ({ onClick, id, disabled }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-auto font-bentham">
      <button
        className={`bg-white flex items-center justify-center w-80 py-3 px-4 sm:py-4 sm:px-6 md:py-5 md:px-8 lg:py-6 lg:px-10 font-medium uppercase text-black text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-3xl leading-tight rounded-full shadow-lg hover:shadow-2xl transition-shadow duration-300 ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
        }`}
        onClick={!disabled ? onClick : undefined} // Evita ejecutar onClick si está deshabilitado
        id={id}
        disabled={disabled} // HTML prop para deshabilitar el botón
      >
        {id === "choice-pokemon" ? "Pokemon" : "Technology"}
      </button>
    </div>
  );
};




export const ButtonStartp: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[9%] w-full font-bentham">
      <Link to="/guess">
        <button
          className="bg-white flex items-center justify-center w-45 py-2 px-4 sm:py-2 sm:px-6 font-medium uppercase text-black text-xl sm:text-2xl leading-tight rounded-full transition-shadow duration-300"
          style={{
            boxShadow: "0px 8px 8px -2px rgba(0, 0, 0, 0.5)",
          }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/640px-Pok%C3%A9_Ball_icon.svg.png"
            alt="Pokeball"
            className="w-8 h-8 sm:w-12 sm:h-12 object-contain z-10 mr-2"
          />
          START
        </button>
      </Link>
    </div>
  );
};


export const NextP: React.FC<ButtonNextProps> = ({ onClick, id }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[10%] w-full font-bentham">
      <button
        className="flex items-center justify-center  text-white py-4 px-6 sm:py-6 sm:px-8 font-semibold uppercase text-2xl sm:text-3xl transition-transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 rounded-lg shadow-lg"
        style={{ transform: "rotate(0deg)" }}
        onClick={onClick}
        id={id}
        aria-label="Next Button"
      >
        <div className="absolute inset-0 bg-black opacity-60 rounded-lg shadow-x z-0"></div>
        <span className="mr-4 z-10">NEXT</span>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/640px-Pok%C3%A9_Ball_icon.svg.png"
          alt="Pokeball"
          className="w-12 h-12 sm:w-16 sm:h-16 object-contain z-10"
        />
      </button>
    </div>
  );
};

interface PokemonCardProps {
  onClick: () => void;
  id: string;
}export const PokemonCard: React.FC<PokemonCardProps> = ({ onClick, id }) => {
  const userLanguage = navigator.language || navigator.languages[0];
  const isSpanish = userLanguage.startsWith("es");

  // Función para manejar el clic en el ícono de la Pokébola
  const handleClick = () => {
    onClick(); // Activar la acción del clic
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        width: "50%", // Hacer el deslizable más corto
        maxWidth: "200px", // Limitar el tamaño máximo
        height: "60px",
        borderRadius: "30px",
        backgroundColor: "#ddd",
        margin: "0 auto",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer", // Cambiar el cursor al hacer hover
      }}
      onClick={handleClick} // Activar la acción con un clic en todo el contenedor
    >
      <div
        style={{
          fontSize: "16px",
          color: "black",
          fontWeight: "bold",
          zIndex: 100,
          marginBottom: "10px",
        }}
      >
        {isSpanish ? "Haz clic para continuar" : "Click to continue"}
      </div>

      <div
        style={{
          width: "50px",
          height: "50px",
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/640px-Pok%C3%A9_Ball_icon.svg.png"
          alt="Pokeball"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
};
