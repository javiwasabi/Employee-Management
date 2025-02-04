import React, { useState, useEffect } from "react";
import { NextP } from "./buttons";
import '../styles/background.css';
import "../styles/poke.css";

const typeColor: Record<string, string> = {
  bug: "#26de81",
  dragon: "#CEB154",
  electric: "#F3C92A",
  fairy: "#FF0069",
  fighting: "#30336b",
  fire: "#f0932b",
  flying: "#81ecec",
  grass: "#00b894",
  ground: "#EFB549",
  ghost: "#a55eea",
  ice: "#74b9ff",
  normal: "#95afc0",
  poison: "#6c5ce7",
  psychic: "#a29bfe",
  rock: "#2d3436",
  water: "#59A2E6",
};

interface CardPropsp {
  imageUrl: string; // URL de la imagen a mostrar
  context: string; // Nombre de la tecnología o Pokémon
  isCorrect: boolean; // Si la respuesta fue correcta
  isFlipped: boolean; // Estado de la tarjeta (adivinando o revelada)
  score: number; // Puntaje actual
  onNext: () => void; // Callback para pasar a la siguiente tarjeta
  namep: string;
}

export const CardPok: React.FC<CardPropsp> = ({
  imageUrl,
  context,
  isCorrect,
  isFlipped,
  score,
  namep,
  onNext,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  
  const [pokemon, setPokemon] = useState<any>(null);

  

  // Sincroniza el estado interno con isFlipped
  useEffect(() => {
    setIsRevealed(isFlipped);
  }, [isFlipped]);

  
  return (
    <div className="flex absolute bottom-0">
      <div className="relative flex flex-col items-center">
        {/* Ball */}
        <div
          className="relative w-40 h-40 ball "
          style={{
            transform: isRevealed ? "rotate(0deg)" : "rotateY(180deg)",
            transition: "transform 0.5s ease-in-out",
          }}
        >
          <div className="inside"></div>
          <div className="center"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-transparent rounded-b-full "></div>
        </div>

        {/* Pokémon / Card */}
        <div
          className={`absolute transition-transform duration-500 ${
            isRevealed
              ? "-translate-y-[40%] opacity-100 scale-100"
              : "translate-y-[50%] opacity-0 scale-90"
          }`}
        >
          {/* Card */}
          <div
            id="card"
            style={{
              background: `radial-gradient(circle at 70% 0%,rgb(200, 210, 218), 46%, #EEEEEE 36%)`,
              transform: isRevealed ? "scale(1)" : "scale(0.7)",
              opacity: isRevealed ? "1" : "0",
            }}
            className="card"
          >
     
            <img
              src={imageUrl}
              alt={context}
              className="card-image"
              style={{
                transform: isRevealed ? "scale(1)" : "scale(0.7)",
                transition: "transform 0.5s ease",
              }}
            />
            <h2 className="poke-name font-light font-bentham">{context}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};
