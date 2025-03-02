import React from "react";
import { NavLink } from "react-router-dom";
import { FaTasks, FaBell, FaUsers, FaChartBar } from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col p-4 space-y-4">
      <div className="text-3xl font-bold text-blue-600 mb-6">⚡ Dashboard</div>
      <NavLink to="/dashboard" end className={({ isActive }) => `flex items-center space-x-2 py-2 px-4 rounded-lg ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}>
        <FaChartBar className="text-lg" /> <span>Overview</span>
      </NavLink>
      <NavLink to="/dashboard/tasks" className={({ isActive }) => `flex items-center space-x-2 py-2 px-4 rounded-lg ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}>
        <FaTasks className="text-lg" /> <span>Tasks</span>
      </NavLink>
      <NavLink to="/dashboard/collaboration" className={({ isActive }) => `flex items-center space-x-2 py-2 px-4 rounded-lg ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}>
        <FaUsers className="text-lg" /> <span>Collaboration</span>
      </NavLink>
      <NavLink to="/dashboard/notifications" className={({ isActive }) => `flex items-center space-x-2 py-2 px-4 rounded-lg ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}>
        <FaBell className="text-lg" /> <span>Notifications</span>
      </NavLink>
    </aside>
  );
};

export default Sidebar;
