import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    deadline: "",
  });

  useEffect(() => {
    if (!user || !user.userId) return;

    fetch(`https://trackify-lemon.vercel.app/api/tasks?userId=${user.userId}`)
      .then((res) => res.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch((err) => console.error("🚨 Error fetching tasks:", err));
  }, [user]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline) return;

    try {
      if (taskBeingEdited) {
        const updatedTask = { ...newTask, userId: user.userId };
        await fetch(`https://trackify-lemon.vercel.app/api/tasks/${taskBeingEdited}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        });

        setTasks((prev) =>
          prev.map((task) => (task._id === taskBeingEdited ? updatedTask : task))
        );
        setTaskBeingEdited(null);
      } else {
        const newTaskWithUser = { ...newTask, userId: user.userId };
        const response = await fetch("https://trackify-lemon.vercel.app/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTaskWithUser),
        });

        const addedTask = await response.json();
        setTasks((prev) => [...prev, addedTask]);
      }

      setNewTask({ title: "", description: "", status: "Pending", priority: "Medium", deadline: "" });
      setIsFormVisible(false);
    } catch (err) {
      console.error("🚨 Error adding/updating task:", err);
    }
  };

  const handleEditTask = (task) => {
    setNewTask(task);
    setTaskBeingEdited(task._id);
    setIsFormVisible(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`https://trackify-lemon.vercel.app/api/tasks/${taskId}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error("🚨 Error deleting task:", err);
    }
  };

  return (
    <div className="py-6 bg-white min-h-[calc(100vh-12rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Tasks</h1>
          <button
            className="bg-teal-500 text-white hover:bg-teal-600 flex items-center px-3 py-2 rounded-lg transition-colors"
            onClick={() => setIsFormVisible(!isFormVisible)}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {taskBeingEdited ? "Edit Task" : "Add Task"}
          </button>
        </div>

        {isFormVisible && (
          <div className="mt-6 bg-gray-50 shadow-md rounded-lg p-4 md:p-6">
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border bg-white text-gray-700 rounded-md "
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border bg-white text-gray-700 rounded-md "
                ></textarea>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-3 py-2 border bg-white text-gray-700 rounded-md "
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  className="w-full px-3 py-2 border bg-white text-gray-700 rounded-md "
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Deadline</label>
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  required
                  className="w-full px-3 py-2 border bg-white text-gray-700 rounded-md "
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsFormVisible(false)}
                  className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-500 text-white hover:bg-teal-600 px-4 py-2 rounded-md transition-colors"
                >
                  {taskBeingEdited ? "Update Task" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-6 bg-gray-50 shadow-md rounded-lg p-4 md:p-6">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-900 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    Task
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                    Deadline
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                      No tasks available.
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-100 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-700 truncate max-w-[150px] lg:max-w-none">
                        {task.title}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 hidden lg:table-cell truncate max-w-[200px]">
                        {task.description}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 hidden md:table-cell">
                        {task.priority}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 hidden sm:table-cell">
                        {task.status}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 hidden sm:table-cell whitespace-nowrap">
                        {new Date(task.deadline).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right space-x-3">
                        <button onClick={() => handleEditTask(task)}>
                          <PencilIcon className="h-5 w-5 text-yellow-500 hover:text-yellow-600" />
                        </button>
                        <button onClick={() => handleDeleteTask(task._id)}>
                          <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}