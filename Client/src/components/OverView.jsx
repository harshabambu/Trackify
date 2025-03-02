import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Calendar from "react-calendar"; // ✅ Install: npm install react-calendar
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";

const Overview = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [completedDays, setCompletedDays] = useState(new Set());

  useEffect(() => {
    if (!user || !user.userId) return;

    fetch(`http://localhost:5000/api/tasks?userId=${user.userId}`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(Array.isArray(data) ? data : []);

        // ✅ Track which days have completed tasks
        const completed = new Set(
          data
            .filter((task) => task.status === "Completed" && task.completedAt) // ✅ Ensure completedAt exists
            .map((task) => new Date(task.completedAt).toDateString()) // ✅ Use completedAt for consistency streak
        );
        setCompletedDays(completed);
      })
      .catch((err) => console.error("🚨 Error fetching tasks:", err));
  }, [user]);

  // ✅ Function to Update Task Status
  const updateTaskStatus = async (_id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      // ✅ Update UI instantly
      setTasks(
        tasks.map((task) =>
          task._id === _id ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("🚨 Error updating task:", error);
    }
  };

  return (
    <div className="bg-gray-100 p-6 text-gray-900 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Overview</h1>

      {/* ✅ Total Tasks & Completed Tasks */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h2 className="text-lg">Total Tasks</h2>
          <p className="text-3xl font-bold">{tasks.length}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h2 className="text-lg">Completed Tasks</h2>
          <p className="text-3xl font-bold">
            {tasks.filter((task) => task.status === "Completed").length}
          </p>
        </div>
      </div>

      {/* ✅ LeetCode-style Calendar */}
      <div className="bg-white p-6 rounded-lg mb-6 shadow-sm">
        <h2 className="text-lg mb-4">Task Completion Calendar</h2>
        <Calendar
          tileContent={({ date }) => {
            const dateString = date.toDateString();
            return completedDays.has(dateString) ? (
              <span className="text-green-500 text-xl">✔</span> // ✅ Show tick for completed days
            ) : null;
          }}
        />
      </div>

      {/* ✅ Task List with Status Update */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Your Tasks</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-400">No tasks available.</td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task._id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{task.title}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                          task.status === "Completed"
                            ? "bg-green-600 text-white"
                            : task.status === "In Progress"
                            ? "bg-blue-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{task.priority}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {task.deadline
                        ? format(new Date(task.deadline), "MMM dd, yyyy")
                        : "No Deadline"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      {/* ✅ Button to Update Status */}
                      {task.status === "Pending" && (
                        <button
                          onClick={() => updateTaskStatus(task._id, "In Progress")}
                          className="text-blue-500 hover:text-blue-400 text-sm font-medium"
                        >
                          Start Task
                        </button>
                      )}
                      {task.status === "In Progress" && (
                        <button
                          onClick={() => updateTaskStatus(task._id, "Completed")}
                          className="text-green-500 hover:text-green-400 text-sm font-medium"
                        >
                          Complete Task
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
