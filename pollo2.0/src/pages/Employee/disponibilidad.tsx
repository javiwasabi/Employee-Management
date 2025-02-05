import React, { useState } from "react";
import Calendar from "../../components/calendar";
import "../../styles/background.css";
const CalendarLanding: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const renderCardContent = () => {
    if (!selectedDate) {
      return (
        <p className="text-sm text-gray-600">
          Haz clic en una fecha del calendario para ver los registros.
        </p>
      );
    }

    return (
      <div>
        <h3 className="font-bold text-lg text-center">
          Registros del {selectedDate.toDateString()}
        </h3>
        <ul className="mt-2 text-center">
          {/* Aquí puedes agregar lógica para mostrar registros dinámicos */}
          <li className="text-sm text-gray-600">Capacitación 1: 2 horas</li>
          <li className="text-sm text-gray-600">Capacitación 2: 3 horas</li>
          <li className="text-sm text-gray-600">Capacitación 3: 1 hora</li>
        </ul>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-gray-600 to-white flex items-center justify-center">
     
      {/* Calendario */}
      <div className="w-[60%] h-[70vh]  p-4 bg-white rounded-lg shadow-lg">
        <Calendar onClickDay={handleDayClick} />
      </div>

      {/* Card */}
      {selectedDate && (
        <div className="absolute w-[90%] max-w-md p-6 bg-white rounded-xl shadow-2xl flex flex-col items-center">
          {renderCardContent()}
          <button
            onClick={() => setSelectedDate(null)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarLanding;
