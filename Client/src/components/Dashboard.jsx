import React, { useState } from "react";
import { FaTasks, FaCalendarAlt, FaChartBar, FaBell, FaUsers } from "react-icons/fa";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "" });
  const [taskAdded, setTaskAdded] = useState(false);

  const handleTaskSubmit = () => {
    if (newTask.title.trim() && newTask.description.trim()) {
      setTasks([...tasks, newTask]);
      setNewTask({ title: "", description: "", priority: "" }); // Reset fields after adding task
      setTaskAdded(true);
      setTimeout(() => setTaskAdded(false), 3000); // Clear success message after 3 seconds
    } else {
      alert("Both title and description are required!");
    }
  };

  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "tasks":
        return (
          <div className="flex">
            <div className="w-1/2 p-6 bg-white rounded-lg shadow-lg border border-gray-200 mr-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-8">Add Task</h1>
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-2" htmlFor="title">
                  Task Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter task title"
                />
              </div>
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-2" htmlFor="description">
                  Task Description
                </label>
                <textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter task description"
                />
              </div>
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-2" htmlFor="priority">
                  Task Priority
                </label>
                <select
                  id="priority"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="notImportant">Not Important</option>
                  <option value="important">Important</option>
                  <option value="veryImportant">Very Important</option>
                </select>
              </div>
              <button
                onClick={handleTaskSubmit}
                className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Task
              </button>
              {taskAdded && (
                <p className="mt-4 text-green-600 font-semibold">Task Added Successfully!</p>
              )}
            </div>

            {/* Task List on the Right */}
            <div className="w-1/2 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-4xl font-bold text-gray-800 mb-8">Task List</h2>
              {tasks.length === 0 ? (
                <p className="text-gray-500">No tasks added yet.</p>
              ) : (
                tasks
                  .sort((a, b) => {
                    const priorityOrder = {
                      veryImportant: 1,
                      important: 2,
                      notImportant: 3,
                    };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                  })
                  .map((task, index) => (
                    <div
                      key={index}
                      className={`mb-6 p-4 rounded-md border ${
                        task.priority === "veryImportant"
                          ? "bg-red-100 border-red-500"
                          : task.priority === "important"
                          ? "bg-yellow-100 border-yellow-500"
                          : "bg-green-100 border-green-500"
                      }`}
                    >
                      <h3 className="text-2xl font-semibold text-gray-700">{task.title}</h3>
                      <p className="text-gray-500">{task.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-400">
                          {task.priority === "veryImportant"
                            ? "Very Important"
                            : task.priority === "important"
                            ? "Important"
                            : "Not Important"}
                        </span>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        );
      case "calendar":
        return (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Calendar</h1>
            <p className="text-gray-500">You have 2 scheduled meetings.</p>
          </div>
        );
      case "analytics":
        return (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Analytics</h1>
            <p className="text-gray-500">Your productivity is at 83%.</p>
          </div>
        );
      case "users":
        return (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Users</h1>
            <p className="text-gray-500">Manage team members here.</p>
          </div>
        );
      case "notifications":
        return (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Notifications</h1>
            <p className="text-gray-500">You have 5 new notifications.</p>
          </div>
        );
      default:
        return (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>
            <p className="text-gray-500">Welcome to your dashboard!</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-900">
      {/* Sidebar */}
      <aside className="w-20 bg-gray-100 flex flex-col items-center py-6 space-y-6 shadow-md">
        <div className="text-3xl font-bold text-blue-600">⚡</div>
        <FaTasks
          className={`text-2xl cursor-pointer transition duration-300 ease-in-out ${
            activeSection === "tasks" ? "text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveSection("tasks")}
        />
        <FaCalendarAlt
          className={`text-2xl cursor-pointer transition duration-300 ease-in-out ${
            activeSection === "calendar" ? "text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveSection("calendar")}
        />
        <FaChartBar
          className={`text-2xl cursor-pointer transition duration-300 ease-in-out ${
            activeSection === "analytics" ? "text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveSection("analytics")}
        />
        <FaUsers
          className={`text-2xl cursor-pointer transition duration-300 ease-in-out ${
            activeSection === "users" ? "text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveSection("users")}
        />
        <FaBell
          className={`text-2xl cursor-pointer transition duration-300 ease-in-out ${
            activeSection === "notifications" ? "text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveSection("notifications")}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
};

export default Dashboard;
