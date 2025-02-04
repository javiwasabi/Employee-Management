import React, { useState } from 'react';

interface CalendarProps {
  onClickDay?: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ onClickDay }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleClickDay = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (onClickDay) {
      onClickDay(clickedDate);
    }
  };

  return (<div className="w-full h-full bg-white backdrop-blur-sm mx-auto shadow-xl rounded-lg overflow-hidden z-0">

   
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center z-10">
        <button
          onClick={handlePrevMonth}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Previous
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h1>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Next
        </button>
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-4 p-6">
        {/* Days of the week */}
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}

        {/* Empty spaces for previous month's days */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="border rounded-lg p-2 "></div>
        ))}

        {/* Dates of the current month */}
        {Array.from({ length: daysInMonth }).map((_, index) => (
          <div
            key={`day-${index + 1}`}
            className="border rounded-lg p-2 text-center hover:bg-blue-100 cursor-pointer"
            onClick={() => handleClickDay(index + 1)}
          >
            <div className="text-sm font-medium text-gray-800">{index + 1}</div>
          
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
