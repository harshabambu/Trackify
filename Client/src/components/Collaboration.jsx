import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Collaboration() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
  });

 useEffect(() => {
  if (!user || !user.userId) return;

  fetch(`http://localhost:5000/api/collaboration/users?search=${encodeURIComponent(search)}`)
    .then((res) => res.json())
    .then((data) => setUsers(data.filter((u) => u._id !== user.userId)))
    .catch((err) => console.error("🚨 Error fetching users:", err));

  fetch(`http://localhost:5000/api/collaboration/requests/${user.userId}`)
    .then((res) => res.json())
    .then((data) => setRequests(data))
    .catch((err) => console.error("🚨 Error fetching requests:", err));

  fetch(`http://localhost:5000/api/collaboration/tasks/${user.userId}`)
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(`Server returned ${res.status}: ${text}`);
        });
      }
      return res.json();
    })
    .then((data) => setTasks(data))
    .catch((err) => console.error("🚨 Error fetching tasks:", err));
}, [user, search]);  const sendFriendRequest = async (receiverId) => {
    try {
      const response = await fetch("http://localhost:5000/api/collaboration/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: user.userId, receiverId }),
      });
      const data = await response.json();
      if (response.ok) {
        setRequests([...requests, data.request]);
        toast.success("Friend request sent!");
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error("🚨 Error sending friend request:", err);
      toast.error("Error sending request");
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/collaboration/accept/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(
          requests.map((req) =>
            req._id === requestId ? { ...req, status: "accepted" } : req
          )
        );
        toast.success("Friend request accepted!");
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error("🚨 Error accepting friend request:", err);
      toast.error("Error accepting request");
    }
  };

  const assignTask = async (assigneeId) => {
    if (!taskForm.title) {
      toast.error("Please enter a task title");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/collaboration/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignerId: user.userId,
          assigneeId,
          title: taskForm.title,
          description: taskForm.description,
          priority: taskForm.priority,
          deadline: taskForm.deadline || null,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setTasks([...tasks, data.task]);
        setTaskForm({ title: "", description: "", priority: "Medium", deadline: "" });
        toast.success("Task assigned successfully!");
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error("🚨 Error assigning task:", err);
      toast.error("Error assigning task");
    }
  };

  const handleTaskFormChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
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
            {users.map((u) => ( // Removed client-side filtering
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
                    onClick={() => assignTask(u._id)}
                  >
                    Assign Task
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Collaboration Requests</h2>
        {requests.length === 0 ? (
          <p className="text-gray-600 text-center">No requests.</p>
        ) : (
          <ul className="divide-y divide-gray-300">
            {requests.map((req) => (
              <li key={req._id} className="py-4 flex justify-between items-center">
                <p className="text-lg font-medium text-gray-900">
                  {req.sender._id === user.userId
                    ? `Sent to ${req.receiver.username}`
                    : `From ${req.sender.username}`}
                  {" - "}
                  {req.status}
                </p>
                {req.status === "pending" && req.receiver._id === user.userId && (
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    onClick={() => acceptFriendRequest(req._id)}
                  >
                    Accept
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tasks</h2>
        <div className="space-y-4 mb-4">
          <input
            type="text"
            name="title"
            placeholder="Task title..."
            className="w-full p-3 border rounded-lg shadow-sm"
            value={taskForm.title}
            onChange={handleTaskFormChange}
          />
          <textarea
            name="description"
            placeholder="Task description..."
            className="w-full p-3 border rounded-lg shadow-sm"
            value={taskForm.description}
            onChange={handleTaskFormChange}
          />
          <select
            name="priority"
            className="w-full p-3 border rounded-lg shadow-sm"
            value={taskForm.priority}
            onChange={handleTaskFormChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="date"
            name="deadline"
            className="w-full p-3 border rounded-lg shadow-sm"
            value={taskForm.deadline}
            onChange={handleTaskFormChange}
          />
        </div>
        {tasks.length === 0 ? (
          <p className="text-gray-600 text-center">No tasks assigned.</p>
        ) : (
          <ul className="divide-y divide-gray-300">
            {tasks.map((task) => (
              <li key={task._id} className="py-4">
                <p className="text-lg font-medium text-gray-900">{task.title}</p>
                <p className="text-sm text-gray-600">
                  Assigned to {task.userId.username} - {task.status} - Priority: {task.priority}
                  {task.deadline && ` - Due: ${new Date(task.deadline).toLocaleDateString()}`}
                </p>
                {task.description && (
                  <p className="text-sm text-gray-500">{task.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}