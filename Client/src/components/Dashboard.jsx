import React, { useState } from "react";
import { FaTasks, FaCalendarAlt, FaChartBar, FaBell, FaUsers } from "react-icons/fa";
import Tasking from "./Tasking";
import CalendarView from "./Calendar";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "tasking":
        return <Tasking />;
      case "calendar":
        return <CalendarView />;
      default:
        return (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>
            <p className="text-gray-500">Welcome to your dashboard!</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-900">
      {/* Sidebar */}
      <aside className="w-20 bg-gray-100 flex flex-col items-center py-6 space-y-6 shadow-md">
        <div className="text-3xl font-bold text-blue-600">⚡</div>
        <FaTasks
          className={`text-2xl cursor-pointer ${activeSection === "tasking" ? "text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveSection("tasking")}
        />
        <FaCalendarAlt
          className={`text-2xl cursor-pointer ${activeSection === "calendar" ? "text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveSection("calendar")}
        />
        <FaChartBar
          className={`text-2xl cursor-pointer ${activeSection === "analytics" ? "text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveSection("analytics")}
        />
        <FaUsers
          className={`text-2xl cursor-pointer ${activeSection === "users" ? "text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveSection("users")}
        />
        <FaBell
          className={`text-2xl cursor-pointer ${activeSection === "notifications" ? "text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveSection("notifications")}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
};

export default Dashboard;
