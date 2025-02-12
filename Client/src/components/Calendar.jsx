import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarView = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "notImportant", date: "" });
  const [taskAdded, setTaskAdded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Set the selected date in the task form
    setNewTask({ ...newTask, date: date.toLocaleDateString() });
    // Scroll to the Add Task section after date selection
    document.getElementById("addTaskSection").scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleTitleChange = (e) => {
    setNewTask({ ...newTask, title: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setNewTask({ ...newTask, description: e.target.value });
  };

  const handlePriorityChange = (e) => {
    setNewTask({ ...newTask, priority: e.target.value });
  };

  const handleTaskSubmit = () => {
    if (newTask.title.trim() && newTask.description.trim()) {
      setTasks([...tasks, newTask]);
      setNewTask({ title: "", description: "", priority: "notImportant", date: "" });
      setTaskAdded(true);
      setTimeout(() => setTaskAdded(false), 3000);
    } else {
      alert("Both title and description are required!");
    }
  };

  const handleDelete = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const renderTasksForSelectedDate = () => {
    const tasksForDate = tasks.filter((task) => task.date === selectedDate.toLocaleDateString());
    return (
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Tasks for {selectedDate.toLocaleDateString()}</h3>
        {tasksForDate.length === 0 ? (
          <p className="text-gray-500">No tasks added for this date.</p>
        ) : (
          tasksForDate.map((task, index) => (
            <div
              key={index}
              className={`mb-4 p-4 rounded-md border ${
                task.priority === "veryImportant"
                  ? "bg-red-100 border-red-500"
                  : task.priority === "important"
                  ? "bg-yellow-100 border-yellow-500"
                  : "bg-green-100 border-green-500"
              }`}
            >
              <h3 className="text-2xl font-semibold text-gray-700">{task.title}</h3>
              <p className="text-gray-500">{task.description}</p>
              <p className="text-sm text-gray-400">Date: {task.date}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-400">
                  {task.priority === "veryImportant"
                    ? "Very Important"
                    : task.priority === "important"
                    ? "Important"
                    : "Not Important"}
                </span>
                <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700 text-sm">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Calendar</h1>

      {/* Flex Container */}
      <div className="flex space-x-8">
        {/* Calendar Section (Left) */}
        <div className="flex-shrink-0 w-1/3">
          <div className="mb-6">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              className="border border-gray-300 rounded-md shadow-lg p-4"
            />
          </div>
        </div>

        {/* Task List Section (Right) */}
        <div className="flex-grow">
          {renderTasksForSelectedDate()}
        </div>
      </div>

      {/* Task Input Section (Bottom) */}
      <div id="addTaskSection" className="mt-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Add Task</h3>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2" htmlFor="title">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            value={newTask.title}
            onChange={handleTitleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter task title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2" htmlFor="description">
            Task Description
          </label>
          <textarea
            id="description"
            value={newTask.description}
            onChange={handleDescriptionChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter task description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2" htmlFor="priority">
            Task Priority
          </label>
          <select
            id="priority"
            value={newTask.priority}
            onChange={handlePriorityChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="notImportant">Not Important</option>
            <option value="important">Important</option>
            <option value="veryImportant">Very Important</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Task Date</label>
          <input
            type="text"
            value={newTask.date}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
        <button
          onClick={handleTaskSubmit}
          className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Task
        </button>
        {taskAdded && <p className="mt-4 text-green-600 font-semibold">Task Added Successfully!</p>}
      </div>
    </div>
  );
};

export default CalendarView;
