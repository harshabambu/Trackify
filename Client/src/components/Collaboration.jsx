import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Collaboration() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState([]);
  const [tasks, setTasks] = useState({});

  useEffect(() => {
    if (!user || !user.userId) return;

    fetch(`http://localhost:5000/api/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data.filter((u) => u._id !== user.userId)))
      .catch((err) => console.error("🚨 Error fetching users:", err));

    fetch(`http://localhost:5000/api/friend-requests/${user.userId}`)
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error("🚨 Error fetching friend requests:", err));
  }, [user]);

  const sendFriendRequest = async (receiverId) => {
    try {
      await fetch("http://localhost:5000/api/friend-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: user.userId, receiverId }),
      });

      setRequests([...requests, { senderId: user.userId, receiverId }]);
    } catch (err) {
      console.error("🚨 Error sending friend request:", err);
    }
  };

  const assignTask = async (receiverId, taskTitle) => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: receiverId, title: taskTitle, status: "Pending" }),
      });

      if (!response.ok) throw new Error("Failed to assign task");

      setTasks({ ...tasks, [receiverId]: "Task Assigned" });
    } catch (err) {
      console.error("🚨 Error assigning task:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Collaboration</h1>

      <input
        type="text"
        placeholder="Search users..."
        className="w-full max-w-lg p-3 border rounded-lg shadow-sm mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Users</h2>
        {users.length === 0 ? (
          <p className="text-gray-600 text-center">No users found.</p>
        ) : (
          <ul className="divide-y divide-gray-300">
            {users.filter((u) => u.username.toLowerCase().includes(search.toLowerCase())).map((u) => (
              <li key={u._id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium text-gray-900">{u.username}</p>
                  <p className="text-sm text-gray-600">{u.email}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={() => sendFriendRequest(u._id)}
                  >
                    Add Friend
                  </button>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    onClick={() => assignTask(u._id, "New Task")}
                  >
                    Assign Task
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Friend Requests</h2>
        {requests.length === 0 ? (
          <p className="text-gray-600 text-center">No pending friend requests.</p>
        ) : (
          <ul className="divide-y divide-gray-300">
            {requests.map((req) => (
              <li key={req._id} className="py-4 flex justify-between items-center">
                <p className="text-lg font-medium text-gray-900">Request from {req.senderId}</p>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  onClick={() => acceptFriendRequest(req._id)}
                >
                  Accept
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
