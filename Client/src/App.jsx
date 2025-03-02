import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./context/AuthContext";
import Rootlayout from "./Rootlayout";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Overview from "./components/Overview"; // ✅ New
import Tasks from "./components/Tasks";
import Collaboration from "./components/Collaboration";
import Notifications from "./components/Notifications";

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <Routes>
        <Route path="/" element={<Rootlayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<ProtectedRoute element={<Dashboard />} />}>
            <Route path="overview" element={<ProtectedRoute element={<Overview />} />} />
            <Route path="tasks" element={<ProtectedRoute element={<Tasks />} />} />
            <Route path="collaboration" element={<ProtectedRoute element={<Collaboration />} />} />
            <Route path="notifications" element={<ProtectedRoute element={<Notifications />} />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
