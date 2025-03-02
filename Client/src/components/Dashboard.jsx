import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Import authentication context

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
        <aside className="w-64 bg-white shadow-lg flex flex-col p-4 space-y-4">
          <div className="text-3xl font-bold text-blue-600 mb-6">⚡ Dashboard</div>
          <NavLink to="overview" className="py-2 px-4 rounded-lg hover:bg-gray-200">Overview</NavLink>
          <NavLink to="tasks" className="py-2 px-4 rounded-lg hover:bg-gray-200">Tasks</NavLink>
          <NavLink to="collaboration" className="py-2 px-4 rounded-lg hover:bg-gray-200">Collaboration</NavLink>
          <NavLink to="notifications" className="py-2 px-4 rounded-lg hover:bg-gray-200">Notifications</NavLink>
        </aside>
      )}

      {/* ✅ Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* ✅ Show a welcome message only on `/dashboard` */}
        {location.pathname === "/dashboard" ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">Welcome, {userName}! 🎉</h1>
            <p className="mt-2 text-lg text-gray-700">
              Manage your tasks, track progress, and collaborate effortlessly.
            </p>
            <p className="mt-4 text-gray-600">
              Use the sidebar to navigate between sections.
            </p>
            <div className="mt-6">
              <NavLink to="overview" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700">
                Go to Overview 🚀
              </NavLink>
            </div>
          </div>
        ) : (
          <Outlet /> // ✅ Render Overview, Tasks, etc.
        )}
      </main>
    </div>
  );
};

export default Dashboard;
