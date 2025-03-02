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
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (!user || !user.userId) return;

    setLoading(true);
    Promise.all([
      fetch(`http://localhost:5000/api/collaboration/users?search=${encodeURIComponent(search)}`)
        .then((res) => res.json())
        .then((data) => setUsers(data.filter((u) => u._id !== user.userId)))
        .catch((err) => console.error("🚨 Error fetching users:", err)),

      fetch(`http://localhost:5000/api/collaboration/requests/${user.userId}`)
        .then((res) => res.json())
        .then((data) => setRequests(data))
        .catch((err) => console.error("🚨 Error fetching requests:", err)),

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
        .catch((err) => console.error("🚨 Error fetching tasks:", err)),
    ]).finally(() => setLoading(false));
  }, [user, search]);

  const sendFriendRequest = async (receiverId) => {
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
        setRequests(requests.map((req) => (req._id === requestId ? { ...req, status: "accepted" } : req)));
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

  const completeTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/collaboration/tasks/${taskId}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(tasks.map((task) => (task._id === taskId ? data.task : task)));
        toast.success("Task marked as completed!");
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error("🚨 Error completing task:", err);
      toast.error("Error completing task");
    }
  };

  const handleTaskFormChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const assignedByMe = tasks.filter((task) => task.assignerId?._id === user.userId);
  const assignedToMe = tasks.filter((task) => task.userId?._id === user.userId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Collaboration Dashboard</h1>

      {/* Search and Users */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Find Collaborators</h2>
        <input
          type="text"
          placeholder="Search users by username..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {users.length === 0 ? (
          <p className="text-gray-500 text-center">No users found.</p>
        ) : (
          <ul className="space-y-3">
            {users.map((u) => (
              <li key={u._id} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <div>
                  <p className="text-lg font-medium text-gray-800">{u.username}</p>
                  <p className="text-sm text-gray-600">{u.email}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => sendFriendRequest(u._id)}
                  >
                    Add Friend
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    onClick={() => assignTask(u._id)}
                  >
                    Assign Task
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Collaboration Requests */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Collaboration Requests</h2>
        {requests.length === 0 ? (
          <p className="text-gray-500 text-center">No pending requests.</p>
        ) : (
          <ul className="space-y-3">
            {requests.map((req) => (
              <li key={req._id} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <p className="text-lg font-medium text-gray-800">
                  {req.sender?._id === user.userId
                    ? `Sent to ${req.receiver?.username || "Unknown"}`
                    : `From ${req.sender?.username || "Unknown"}`}{" "}
                  - <span className="text-sm text-gray-600">{req.status}</span>
                </p>
                {req.status === "pending" && req.receiver?._id === user.userId && (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
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

      {/* Tasks */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Task Management</h2>

        {/* Task Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            name="title"
            placeholder="Task title..."
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={taskForm.title}
            onChange={handleTaskFormChange}
          />
          <textarea
            name="description"
            placeholder="Task description..."
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={taskForm.description}
            onChange={handleTaskFormChange}
            rows="3"
          />
          <select
            name="priority"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={taskForm.deadline}
            onChange={handleTaskFormChange}
          />
        </div>

        {/* Assigned by Me */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-600 mb-3">Tasks Assigned by Me</h3>
          {assignedByMe.length === 0 ? (
            <p className="text-gray-500">No tasks assigned by you.</p>
          ) : (
            <ul className="space-y-3">
              {assignedByMe.map((task) => (
                <li key={task._id} className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-lg font-medium text-gray-800">{task.title}</p>
                  <p className="text-sm text-gray-600">
                    Assigned to: {task.userId?.username || "Unknown"} | Status: {task.status} | Priority: {task.priority}
                    {task.deadline && ` | Due: ${new Date(task.deadline).toLocaleDateString()}`}
                  </p>
                  {task.description && <p className="text-sm text-gray-500 mt-1">{task.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Assigned to Me */}
        <div>
          <h3 className="text-xl font-semibold text-gray-600 mb-3">Tasks Assigned to Me</h3>
          {assignedToMe.length === 0 ? (
            <p className="text-gray-500">No tasks assigned to you.</p>
          ) : (
            <ul className="space-y-3">
              {assignedToMe.map((task) => (
                <li key={task._id} className="p-3 bg-gray-100 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-800">{task.title}</p>
                    <p className="text-sm text-gray-600">
                      Assigned by: {task.assignerId?.username || "Unknown"} | Status: {task.status} | Priority: {task.priority}
                      {task.deadline && ` | Due: ${new Date(task.deadline).toLocaleDateString()}`}
                    </p>
                    {task.description && <p className="text-sm text-gray-500 mt-1">{task.description}</p>}
                  </div>
                  {task.status === "Pending" && (
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                      onClick={() => completeTask(task._id)}
                    >
                      Mark Complete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}