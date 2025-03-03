import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Import authentication context
import { FaChartBar, FaTasks, FaUsers, FaBell, FaGamepad } from "react-icons/fa";
import ChatBot from "../components/ChatBot";

const Dashboard = () => {
  const location = useLocation();
  const { user } = useAuth(); // ✅ Get logged-in user
  const userName = user?.username || "User"; // ✅ Fallback if no username

  // Show sidebar only if inside a subpage (not on main /dashboard)
  const showSidebar = location.pathname !== "/dashboard";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ✅ Sidebar (only visible when on a subpage) */}
      {showSidebar && (
        <aside className="w-20 bg-white shadow-lg flex flex-col items-center py-6 space-y-6 rounded-r-xl">
          <NavLink
            to="overview"
            className="flex justify-center p-3 rounded-lg transition duration-200 hover:bg-teal-400"
          >
            <FaChartBar className="text-xl text-gray-600 transition duration-200" />
          </NavLink>
          <NavLink
            to="tasks"
            className="flex justify-center p-3 rounded-lg transition duration-200 hover:bg-teal-400"
          >
            <FaTasks className="text-xl text-gray-600 transition duration-200" />
          </NavLink>
          <NavLink
            to="collaboration"
            className="flex justify-center p-3 rounded-lg transition duration-200 hover:bg-teal-400"
          >
            <FaUsers className="text-xl text-gray-600 transition duration-200" />
          </NavLink>
          <NavLink
            to="notifications"
            className="flex justify-center p-3 rounded-lg transition duration-200 hover:bg-teal-400"
          >
            <FaBell className="text-xl text-gray-600 transition duration-200" />
          </NavLink>
          <NavLink
            to="games"
            className="flex justify-center p-3 rounded-lg transition duration-200 hover:bg-teal-400"
          >
            <FaGamepad className="text-xl text-gray-600 transition duration-200" />
          </NavLink>
        </aside>
      )}

      {/* ✅ Main Content */}
      <main className="flex-1 p-8 overflow-y-auto relative">
        {/* ✅ Show a welcome message only on `/dashboard` */}
        {location.pathname === "/dashboard" ? (
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-4xl font-bold text-gray-900">Welcome, {userName}! 🎉</h1>
            <p className="mt-2 text-lg text-gray-700">
              Manage your tasks, track progress, and collaborate effortlessly.
            </p>
            <p className="mt-4 text-gray-600">
              Use the sidebar to navigate between sections.
            </p>
            <div className="mt-6">
              <NavLink to="overview" className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700">
                Go to Overview 🚀
              </NavLink>
            </div>
          </div>
        ) : (
          <Outlet /> // ✅ Render Overview, Tasks, etc.
        )}

        {/* ✅ Add Chatbot Floating Popup */}
        <ChatBot />
      </main>
    </div>
  );
};

export default Dashboard;
