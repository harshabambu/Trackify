import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

const Overview = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [completedDays, setCompletedDays] = useState(new Set());
  const [statusData, setStatusData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);

  const COLORS = ["#14b8a6", "#facc15", "#f97316"]; // teal-400, yellow-400, orange-400

  useEffect(() => {
    if (!user || !user.userId) return;

    fetch(`https://trackify-lemon.vercel.app/api/tasks?userId=${user.userId}`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(Array.isArray(data) ? data : []);
        const completed = new Set(
          data
            .filter((task) => task.status === "Completed" && task.completedAt)
            .map((task) => new Date(task.completedAt).toDateString())
        );
        setCompletedDays(completed);

        // Status Data
        const statusCounts = {
          Completed: data.filter((t) => t.status === "Completed").length,
          "In Progress": data.filter((t) => t.status === "In Progress").length,
          Pending: data.filter((t) => t.status === "Pending").length,
        };
        setStatusData(
          Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
        );

        // Priority Data
        const priorityCounts = {
          High: data.filter((t) => t.priority === "High").length,
          Medium: data.filter((t) => t.priority === "Medium").length,
          Low: data.filter((t) => t.priority === "Low").length,
        };
        setPriorityData(
          Object.entries(priorityCounts).map(([name, value]) => ({ name, value }))
        );
      })
      .catch((err) => console.error("🚨 Error fetching tasks:", err));
  }, [user]);

  const updateTaskStatus = async (_id, newStatus) => {
    try {
      const response = await fetch(`https://trackify-lemon.vercel.app/api/tasks/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      setTasks((prev) =>
        prev.map((task) =>
          task._id === _id
            ? {
                ...task,
                status: newStatus,
                completedAt: newStatus === "Completed" ? new Date() : task.completedAt,
              }
            : task
        )
      );

      if (newStatus === "Completed") {
        setCompletedDays((prev) => new Set(prev).add(new Date().toDateString()));
      }
    } catch (error) {
      console.error("🚨 Error updating task:", error);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 border border-gray-700 rounded shadow-sm">
          <p className="font-medium text-gray-200 font-poppins">{`${label || payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 md:p-6 text-gray-900 rounded-xl shadow-lg min-h-[calc(100vh-12rem)] font-poppins">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
        Overview <span className="text-gray-500">({user?.username || "User"})</span>
      </h1>

      {/* Stats and Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-base md:text-lg text-gray-600">Total Tasks</h2>
          <p className="text-2xl md:text-3xl font-bold text-teal-400">{tasks.length}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-base md:text-lg text-gray-600">Completed Tasks</h2>
          <p className="text-2xl md:text-3xl font-bold text-teal-400">
            {tasks.filter((task) => task.status === "Completed").length}
          </p>
        </div>

        {/* Pie Chart - Status */}
        <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-sm relative">
          <h2 className="text-base md:text-lg text-gray-600 mb-4">Task Status Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="top"
                wrapperStyle={{
                  paddingLeft: "20px",
                  fontSize: "14px",
                  fontFamily: "Poppins, sans-serif",
                }}
                formatter={(value) => (
                  <span className="text-gray-700">
                    {value}: {((statusData.find(d => d.name === value)?.value / tasks.length) * 100 || 0).toFixed(0)}%
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Priority */}
        <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className="text-base md:text-lg text-gray-600 mb-4">Task Priority Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#4b5563" />
              <YAxis allowDecimals={false} stroke="#4b5563" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: "Poppins, sans-serif" }} />
              <Bar dataKey="value" name="Tasks">
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-6 shadow-sm hidden md:block">
        <h2 className="text-base md:text-lg text-gray-600 mb-4">Task Completion Calendar</h2>
        <div className="max-w-full overflow-x-auto">
          <Calendar
            className="bg-gray-50 text-gray-900 border-none rounded-lg font-poppins"
            tileClassName="text-gray-600 hover:bg-gray-200"
            tileContent={({ date }) => {
              const dateString = date.toDateString();
              return completedDays.has(dateString) ? (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <span className="w-2 h-2 bg-teal-400 rounded-full block"></span>
                </div>
              ) : null;
            }}
          />
        </div>
      </div>

      {/* Task Table */}
      <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-sm ">
        <h2 className="text-base md:text-lg text-gray-600 mb-4">Your Tasks</h2>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Task
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                  Deadline
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                    No tasks available.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-100 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-700 truncate max-w-[150px] md:max-w-none">
                      {task.title}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          task.status === "Completed"
                            ? "bg-teal-400 text-white"
                            : task.status === "In Progress"
                            ? "bg-yellow-400 text-white"
                            : "bg-orange-400 text-white"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 hidden md:table-cell">
                      {task.priority}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 hidden sm:table-cell whitespace-nowrap">
                      {task.deadline
                        ? format(new Date(task.deadline), "MMM dd, yyyy")
                        : "No Deadline"}
                    </td>
                    <td className="px-4 py-4 text-right space-x-2">
                      {task.status === "Pending" && (
                        <button
                          onClick={() => updateTaskStatus(task._id, "In Progress")}
                          className="text-teal-400 hover:text-teal-500 text-sm font-medium"
                        >
                          Start
                        </button>
                      )}
                      {task.status === "In Progress" && (
                        <button
                          onClick={() => updateTaskStatus(task._id, "Completed")}
                          className="text-teal-400 hover:text-teal-500 text-sm font-medium"
                        >
                          Complete
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