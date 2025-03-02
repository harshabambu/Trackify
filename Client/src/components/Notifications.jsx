import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user || !user.userId) return;

    fetch(`http://localhost:5000/api/notifications/${user.userId}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("🚨 Error fetching notifications:", err));
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Notifications</h1>
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        {notifications.length === 0 ? (
          <p className="text-gray-600 text-center">No notifications available.</p>
        ) : (
          <ul className="divide-y divide-gray-300">
            {notifications.map((notification) => (
              <li key={notification._id} className="py-4">
                <p className="text-lg font-medium text-gray-900">{notification.title}</p>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-500">{new Date(notification.date).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
