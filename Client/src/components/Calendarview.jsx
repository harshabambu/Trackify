import React, { useState } from "react";
import { format, isSameDay } from "date-fns";

const CalendarView = ({ tasks }) => {
  const today = new Date();
  const monthDays = Array.from({ length: 30 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), i + 1));

  const [completedDays, setCompletedDays] = useState(
    tasks.filter((task) => task.status === "Completed").map((task) => new Date(task.completedAt).toDateString())
  );

  const handleClick = (day) => {
    const dayString = day.toDateString();
    if (completedDays.includes(dayString)) {
      setCompletedDays(completedDays.filter((date) => date !== dayString));
    } else {
      setCompletedDays([...completedDays, dayString]);
    }
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Task Calendar</h2>
      <div className="grid grid-cols-7 gap-2 mt-4">
        {monthDays.map((day) => (
          <div
            key={day}
            onClick={() => handleClick(day)}
            className={`w-14 h-14 flex items-center justify-center cursor-pointer rounded-full ${
              completedDays.includes(day.toDateString())
                ? "bg-green-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            } transition-all duration-200`}
          >
            <span className="text-sm font-semibold">{format(day, "d")}</span>
            {completedDays.includes(day.toDateString()) && (
              <span className="absolute text-xl text-white">
                <i className="fas fa-check-circle" />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
