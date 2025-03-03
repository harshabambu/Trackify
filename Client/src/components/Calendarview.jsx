import React, { useState } from "react";
import { format, isSameDay } from "date-fns";

const CalendarView = ({ tasks }) => {
  const today = new Date();
  const monthDays = Array.from({ length: 30 }, (_, i) =>
    new Date(today.getFullYear(), today.getMonth(), i + 1)
  );

  const [completedDays, setCompletedDays] = useState(
    tasks
      .filter((task) => task.status === "Completed")
      .map((task) => new Date(task.completedAt).toDateString())
  );

  const handleClick = (day) => {
    const dayString = day.toDateString();
    setCompletedDays((prev) =>
      prev.includes(dayString)
        ? prev.filter((date) => date !== dayString)
        : [...prev, dayString]
    );
  };

  return (
    <div className="py-6 bg-white min-h-[calc(100vh-12rem)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 rounded-xl shadow-md p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
              {format(today, "MMMM yyyy")}
            </h2>
            <div className="text-sm text-gray-600">
              {completedDays.length} Completed
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 md:gap-4 mb-6">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {monthDays.map((day) => {
              const isToday = isSameDay(day, today);
              const isCompleted = completedDays.includes(day.toDateString());

              return (
                <div
                  key={day}
                  onClick={() => handleClick(day)}
                  className={`
                    relative aspect-square w-full max-w-[60px] mx-auto
                    flex flex-col items-center justify-center cursor-pointer
                    rounded-lg transition-all duration-300 transform hover:scale-105
                    ${isCompleted
                      ? "bg-teal-400 shadow-lg shadow-teal-200"
                      : isToday
                      ? "bg-teal-100 shadow-md shadow-teal-100"
                      : "bg-gray-100 hover:bg-gray-200"}
                  `}
                >
                  <span
                    className={`
                      text-sm md:text-base font-semibold
                      ${isCompleted || isToday ? "text-white" : "text-gray-700"}
                    `}
                  >
                    {format(day, "d")}
                  </span>
                  {isCompleted && (
                    <span className="text-xs text-white mt-1">✔</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-400"></div>
              <span className="text-gray-600">Completed Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-100"></div>
              <span className="text-gray-600">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-100"></div>
              <span className="text-gray-600">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;