import { useState, useEffect } from "react";
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

    fetch(`http://localhost:5000/api/tasks?userId=${user.userId}`)
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
        await fetch(`http://localhost:5000/api/tasks/${taskBeingEdited}`, {
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
        const response = await fetch("http://localhost:5000/api/tasks", {
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
      await fetch(`http://localhost:5000/api/tasks/${taskId}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error("🚨 Error deleting task:", err);
    }
  };

  return (
    <div className="py-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800">Tasks</h1>
          <button className="bg-teal-400 text-white hover:bg-teal-500 flex items-center px-3 py-2 rounded-lg"
            onClick={() => setIsFormVisible(!isFormVisible)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            {taskBeingEdited ? "Edit Task" : "Add Task"}
          </button>
        </div>

        {isFormVisible && (
          <div className="mt-6 bg-white shadow-lg sm:rounded-lg p-6">
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Title</label>
                <input type="text" value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required className="w-full px-3 py-2 border bg-gray-100 text-gray-700 rounded-md" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <textarea value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border bg-gray-100 text-gray-700 rounded-md"></textarea>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Priority</label>
                <select value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-3 py-2 border bg-gray-100 text-gray-700 rounded-md">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <select value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  className="w-full px-3 py-2 border bg-gray-100 text-gray-700 rounded-md">
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Deadline</label>
                <input type="date" value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  required className="w-full px-3 py-2 border bg-gray-100 text-gray-700 rounded-md" />
              </div>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setIsFormVisible(false)}
                  className="bg-gray-400 text-white hover:bg-gray-500 px-4 py-2 rounded-md">
                  Cancel
                </button>
                <button type="submit"
                  className="bg-teal-400 text-white hover:bg-teal-500 px-4 py-2 rounded-md">
                  {taskBeingEdited ? "Update Task" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-6 bg-white shadow-lg sm:rounded-lg p-6">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-teal-100 text-teal-600">
              <tr>
                <th className="px-6 py-3 text-left">Task</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Priority</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Deadline</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td className="px-6 py-4 text-gray-700">{task.title}</td>
                  <td className="px-6 py-4 text-gray-700">{task.description}</td>
                  <td className="px-6 py-4 text-gray-700">{task.priority}</td>
                  <td className="px-6 py-4 text-gray-700">{task.status}</td>
                  <td className="px-6 py-4 text-gray-700">{new Date(task.deadline).toLocaleDateString()}</td>
                  <td className="px-6 py-4 space-x-3">
                    <button onClick={() => handleEditTask(task)}><PencilIcon className="h-5 w-5 text-teal-400" /></button>
                    <button onClick={() => handleDeleteTask(task._id)}><TrashIcon className="h-5 w-5 text-teal-400" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
