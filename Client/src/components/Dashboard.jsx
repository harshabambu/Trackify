import React from "react";
import { FaTasks, FaCalendarAlt, FaChartBar, FaBell, FaUsers } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-white text-gray-900">
      {/* Sidebar */}
      <aside className="w-20 bg-gray-100 flex flex-col items-center py-6 space-y-6 shadow-md">
        <div className="text-3xl font-bold text-blue-600">⚡</div>
        <FaTasks className="text-gray-500 text-2xl hover:text-blue-600 cursor-pointer transition duration-300 ease-in-out" />
        <FaCalendarAlt className="text-gray-500 text-2xl hover:text-blue-600 cursor-pointer transition duration-300 ease-in-out" />
        <FaChartBar className="text-gray-500 text-2xl hover:text-blue-600 cursor-pointer transition duration-300 ease-in-out" />
        <FaUsers className="text-gray-500 text-2xl hover:text-blue-600 cursor-pointer transition duration-300 ease-in-out" />
        <FaBell className="text-gray-500 text-2xl hover:text-blue-600 cursor-pointer transition duration-300 ease-in-out" />
      </aside>

      {/* Main Dashboard */}
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {/* Top Widgets */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-3">Today's Tasks</h2>
            <p className="text-gray-500">3 Pending</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-3">Meetings</h2>
            <p className="text-gray-500">2 Scheduled</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-3">Activity</h2>
            <p className="text-gray-500">83% Productivity</p>
          </div>
        </div>

        {/* Projects */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Projects</h2>
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold">Design Brief</h3>
            <p className="text-gray-500 text-sm">Completed</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold">UX Design</h3>
            <p className="text-gray-500 text-sm">In Progress</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold">Client Presentation</h3>
            <p className="text-gray-500 text-sm">Scheduled</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold">User Testing</h3>
            <p className="text-gray-500 text-sm">Upcoming</p>
          </div>
        </div>

        {/* Reminders */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-6">Reminders</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <p className="text-gray-500">09:30 AM - Check test results</p>
          <p className="text-gray-500">10:00 AM - Client Presentation</p>
          <p className="text-gray-500">04:15 PM - Add new task</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
