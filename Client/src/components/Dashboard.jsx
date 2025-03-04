import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaChartBar, FaTasks, FaUsers, FaBell, FaGamepad } from "react-icons/fa";
import ChatBot from "../components/ChatBot";

const Dashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const userName = user?.username || "User";
  const showSidebar = location.pathname !== "/dashboard";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Desktop Only */}
      {showSidebar && (
        <aside className="hidden md:flex w-20 bg-white shadow-lg flex-col items-center py-6 space-y-6 rounded-r-xl">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-x-hidden md:p-8 overflow-y-auto relative pb-14 md:pb-8">
          {location.pathname === "/dashboard" ? (
            <div className="text-center max-w-md mx-auto">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                Welcome, {userName}! 🎉
              </h1>
              <p className="mt-2 text-sm md:text-lg text-gray-700">
                Manage your tasks, track progress, and collaborate effortlessly.
              </p>
              <p className="mt-2 md:mt-4 text-xs md:text-gray-600">
                Use the {!showSidebar || window.innerWidth >= 768 ? "sidebar" : "bottom navigation"} to navigate between sections.
              </p>
              <div className="mt-4 md:mt-6">
                <NavLink
                  to="overview"
                  className="bg-indigo-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-lg font-semibold hover:bg-indigo-700"
                >
                  Go to Overview 🚀
                </NavLink>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
          <ChatBot />
        </main>

        {/* Bottom Nav Bar - Mobile Only */}
        {showSidebar && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around items-center py-1 z-50">
            <NavLink
              to="overview"
              className={({ isActive }) =>
                `flex flex-col items-center p-1 ${isActive ? "text-teal-400" : "text-gray-600"} hover:text-teal-400 transition duration-200`
              }
            >
              <FaChartBar className="text-lg" />
              <span className="text-[10px]">Overview</span>
            </NavLink>
            <NavLink
              to="tasks"
              className={({ isActive }) =>
                `flex flex-col items-center p-1 ${isActive ? "text-teal-400" : "text-gray-600"} hover:text-teal-400 transition duration-200`
              }
            >
              <FaTasks className="text-lg" />
              <span className="text-[10px]">Tasks</span>
            </NavLink>
            <NavLink
              to="collaboration"
              className={({ isActive }) =>
                `flex flex-col items-center p-1 ${isActive ? "text-teal-400" : "text-gray-600"} hover:text-teal-400 transition duration-200`
              }
            >
              <FaUsers className="text-lg" />
              <span className="text-[10px]">Collab</span>
            </NavLink>
            <NavLink
              to="notifications"
              className={({ isActive }) =>
                `flex flex-col items-center p-1 ${isActive ? "text-teal-400" : "text-gray-600"} hover:text-teal-400 transition duration-200`
              }
            >
              <FaBell className="text-lg" />
              <span className="text-[10px]">Notifs</span>
            </NavLink>
            <NavLink
              to="games"
              className={({ isActive }) =>
                `flex flex-col items-center p-1 ${isActive ? "text-teal-400" : "text-gray-600"} hover:text-teal-400 transition duration-200`
              }
            >
              <FaGamepad className="text-lg" />
              <span className="text-[10px]">Games</span>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;