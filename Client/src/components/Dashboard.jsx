import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaTasks, FaCalendarAlt, FaChartBar, FaBell, FaUsers } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col p-4 space-y-4">
        <div className="text-3xl font-bold text-blue-600 mb-6">⚡ Dashboard</div>
        <NavLink
          to="tasking"
          className={({ isActive }) =>
            `flex items-center space-x-2 py-2 px-4 rounded-lg ${
              isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
            }`
          }
        >
          <FaTasks className="text-lg" /> <span>Tasks</span>
        </NavLink>
        <NavLink
          to="calendar"
          className={({ isActive }) =>
            `flex items-center space-x-2 py-2 px-4 rounded-lg ${
              isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
            }`
          }
        >
          <FaCalendarAlt className="text-lg" /> <span>Calendar</span>
        </NavLink>
        <NavLink
          to="analytics"
          className={({ isActive }) =>
            `flex items-center space-x-2 py-2 px-4 rounded-lg ${
              isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
            }`
          }
        >
          <FaChartBar className="text-lg" /> <span>Analytics</span>
        </NavLink>
        <NavLink
          to="users"
          className={({ isActive }) =>
            `flex items-center space-x-2 py-2 px-4 rounded-lg ${
              isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
            }`
          }
        >
          <FaUsers className="text-lg" /> <span>Users</span>
        </NavLink>
        <NavLink
          to="notifications"
          className={({ isActive }) =>
            `flex items-center space-x-2 py-2 px-4 rounded-lg ${
              isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
            }`
          }
        >
          <FaBell className="text-lg" /> <span>Notifications</span>
        </NavLink>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet /> {/* This will render the child routes (Tasking, Calendar, etc.) */}
      </main>
    </div>
  );
};

export default Dashboard;
