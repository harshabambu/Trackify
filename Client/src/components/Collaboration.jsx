import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

export default function Collaboration() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskModal, setTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
    assigneeId: "",
    assigneeName: "",
  });
  const [friendSearch, setFriendSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const BASE_URL = "https://trackify-lemon.vercel.app"

  const fetchData = async () => {
    if (!user || !user.userId) return;

    setLoading(true);
    setError(null);
    try {
      const [usersRes, requestsRes, friendsRes, tasksRes] = await Promise.all([
        fetch(`${BASE_URL}/api/collaboration/users?search=${encodeURIComponent(search)}`).then((res) => {
          if (!res.ok) throw new Error(`Users fetch failed: ${res.status}`);
          return res.json();
        }),
        fetch(`${BASE_URL}/api/collaboration/requests/${user.userId}`).then((res) => {
          if (!res.ok) throw new Error(`Requests fetch failed: ${res.status}`);
          return res.json();
        }),
        fetch(`${BASE_URL}/api/collaboration/friends/${user.userId}`).then((res) => {
          if (!res.ok) throw new Error(`Friends fetch failed: ${res.status}`);
          return res.json();
        }),
        fetch(`${BASE_URL}/api/collaboration/tasks/${user.userId}`).then((res) => {
          if (!res.ok) throw new Error(`Tasks fetch failed: ${res.status}`);
          return res.json();
        }),
      ]);
      setUsers(usersRes.filter((u) => u._id !== user.userId));
      setRequests(requestsRes);
      setFriends(friendsRes);
      setTasks(tasksRes);
    } catch (err) {
      console.error("🚨 Fetch error:", err);
      setError("Failed to load data. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, search, refreshKey]);

  const sendFriendRequest = async (receiverId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/collaboration/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: user.userId, receiverId }),
      });
      const data = await response.json();
      if (response.ok) {
        setRequests([...requests, data.request]);
        setRefreshKey((prev) => prev + 1);
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
      const response = await fetch(`${BASE_URL}/api/collaboration/accept/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(requests.filter((req) => req._id !== requestId));
        setFriends([...friends, data.request]);
        setRefreshKey((prev) => prev + 1);
        toast.success("Friend request accepted!");
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error("🚨 Error accepting friend request:", err);
      toast.error("Error accepting request");
    }
  };

  const assignTask = async () => {
    if (!taskForm.title || !taskForm.assigneeId) {
      toast.error("Please enter a task title and select an assignee");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/collaboration/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignerId: user.userId,
          assigneeId: taskForm.assigneeId,
          title: taskForm.title,
          description: taskForm.description,
          priority: taskForm.priority,
          deadline: taskForm.deadline || null,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setTasks([...tasks, data.task]);
        setTaskForm({ title: "", description: "", priority: "Medium", deadline: "", assigneeId: "", assigneeName: "" });
        setTaskModal(false);
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
      const response = await fetch(`${BASE_URL}/api/collaboration/tasks/${taskId}/complete`, {
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

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/collaboration/tasks/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== taskId));
        toast.success("Task deleted successfully!");
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error("🚨 Error deleting task:", err);
      toast.error("Error deleting task");
    }
  };

  const handleTaskFormChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const selectFriend = (friend) => {
    setTaskForm({ ...taskForm, assigneeId: friend._id, assigneeName: friend.username });
    setFriendSearch(friend.username);
  };

  const assignedByMe = tasks.filter((task) => task.assignerId?._id === user.userId);
  const assignedToMe = tasks.filter((task) => task.userId?._id === user.userId);
  const filteredFriends = friends.filter((f) =>
    (f.sender._id === user.userId ? f.receiver.username : f.sender.username)
      .toLowerCase()
      .includes(friendSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-black text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}. Please check if the server is running.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8 text-center">Collaboration Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-black mb-4">Find Collaborators</h2>
              <input
                type="text"
                placeholder="Search users by username..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 mb-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && users.length > 0 && (
                <ul className="space-y-2 max-h-60 overflow-y-auto bg-gray-50 rounded-lg p-2">
                  {users.map((u) => {
                    const isFriend = friends.some(
                      (f) => (f.sender._id === u._id || f.receiver._id === u._id) && f.status === "accepted"
                    );
                    const isPending = requests.some(
                      (r) => r.sender._id === user.userId && r.receiver._id === u._id && r.status === "pending"
                    );
                    return (
                      <li key={u._id} className="p-3 bg-teal-50 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="text-lg font-medium text-black">{u.username}</p>
                          <p className="text-sm text-gray-600">{u.email}</p>
                        </div>
                        {!isFriend && !isPending && (
                          <button
                            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
                            onClick={() => sendFriendRequest(u._id)}
                          >
                            Add Friend
                          </button>
                        )}
                        {isPending && <p className="text-teal-400">Request Sent</p>}
                        {isFriend && <p className="text-teal-400">Friend</p>}
                      </li>
                    );
                  })}
                </ul>
              )}
              {search && users.length === 0 && <p className="text-gray-500 text-center">No users found.</p>}
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-black">Task Management</h2>
                <button
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
                  onClick={() => setTaskModal(true)}
                >
                  Assign Task
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-black mb-3">Tasks Assigned by Me</h3>
                {assignedByMe.length === 0 ? (
                  <p className="text-gray-500">No tasks assigned by you.</p>
                ) : (
                  <ul className="space-y-3">
                    {assignedByMe.map((task) => (
                      <li key={task._id} className="p-3 bg-teal-50 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="text-lg font-medium text-black">{task.title}</p>
                          <p className="text-sm text-gray-600">
                            Assigned to: {task.userId?.username || "Unknown"} | Status:{" "}
                            <span className={task.status === "Completed" ? "text-green-500" : "text-yellow-500"}>
                              {task.status}
                            </span>{" "}
                            | Priority: {task.priority}
                            {task.deadline && ` | Due: ${new Date(task.deadline).toLocaleDateString()}`}
                          </p>
                          {task.description && <p className="text-sm text-gray-500 mt-1">{task.description}</p>}
                        </div>
                        {task.status === "Completed" && (
                          <button
                            className="text-red-500 hover:text-red-600 transition"
                            onClick={() => deleteTask(task._id)}
                          >
                            <FaTrash size={20} />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3 className="text-xl font-semibold text-black mb-3">Tasks Assigned to Me</h3>
                {assignedToMe.length === 0 ? (
                  <p className="text-gray-500">No tasks assigned to you.</p>
                ) : (
                  <ul className="space-y-3">
                    {assignedToMe.map((task) => (
                      <li key={task._id} className="p-3 bg-teal-50 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="text-lg font-medium text-black">{task.title}</p>
                          <p className="text-sm text-gray-600">
                            Assigned by: {task.assignerId?.username || "Unknown"} | Status:{" "}
                            <span className={task.status === "Completed" ? "text-green-500" : "text-yellow-500"}>
                              {task.status}
                            </span>{" "}
                            | Priority: {task.priority}
                            {task.deadline && ` | Due: ${new Date(task.deadline).toLocaleDateString()}`}
                          </p>
                          {task.description && <p className="text-sm text-gray-500 mt-1">{task.description}</p>}
                        </div>
                        <div className="flex space-x-2">
                          {task.status === "Pending" && (
                            <button
                              className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
                              onClick={() => completeTask(task._id)}
                            >
                              Mark Complete
                            </button>
                          )}
                          {task.status === "Completed" && (
                            <button
                              className="text-red-500 hover:text-red-600 transition"
                              onClick={() => deleteTask(task._id)}
                            >
                              <FaTrash size={20} />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white shadow-lg rounded-xl p-6 h-72">
              <h2 className="text-2xl font-semibold text-black mb-4 sticky top-0 bg-white z-10 py-2 border-b border-gray-200">
                My Friends
              </h2>
              <div className="overflow-y-auto max-h-[calc(16rem-4rem)]"> {/* Adjust height minus title */}
                {friends.length === 0 ? (
                  <p className="text-gray-500">No friends yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {friends.map((f) => {
                      const friend = f.sender._id === user.userId ? f.receiver : f.sender;
                      return (
                        <li key={f._id} className="p-3 bg-teal-50 rounded-lg">
                          <p className="text-lg font-medium text-black">{friend.username}</p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6 h-72">
              <h2 className="text-2xl font-semibold text-black mb-4 sticky top-0 bg-white z-10 py-2 border-b border-gray-200">
                Collaboration Requests
              </h2>
              <div className="overflow-y-auto max-h-[calc(16rem-4rem)]"> {/* Adjust height minus title */}
                {requests.length === 0 ? (
                  <p className="text-gray-500">No pending requests.</p>
                ) : (
                  <ul className="space-y-3">
                    {requests.map((req) => (
                      <li key={req._id} className="p-3 bg-teal-50 rounded-lg flex justify-between items-center">
                        <p className="text-lg font-medium text-black">
                          {req.sender?._id === user.userId
                            ? `Sent to ${req.receiver?.username || "Unknown"}`
                            : `From ${req.sender?.username || "Unknown"}`}
                        </p>
                        {req.status === "pending" && req.receiver?._id === user.userId && (
                          <button
                            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
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
            </div>
          </div>
        </div>

        {taskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">
              <h2 className="text-2xl font-semibold text-black mb-4">Assign a Task</h2>
              <input
                type="text"
                name="title"
                placeholder="Task title..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={taskForm.title}
                onChange={handleTaskFormChange}
              />
              <textarea
                name="description"
                placeholder="Task description..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={taskForm.description}
                onChange={handleTaskFormChange}
                rows="3"
              />
              <select
                name="priority"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
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
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={taskForm.deadline}
                onChange={handleTaskFormChange}
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search friends to assign..."
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  value={friendSearch}
                  onChange={(e) => setFriendSearch(e.target.value)}
                />
                {friendSearch && (
                  <ul className="absolute z-10 w-full max-h-40 overflow-y-auto bg-gray-50 rounded-lg shadow-lg mt-1">
                    {filteredFriends.map((f) => {
                      const friend = f.sender._id === user.userId ? f.receiver : f.sender;
                      return (
                        <li
                          key={f._id}
                          className="p-3 bg-teal-50 hover:bg-teal-100 cursor-pointer flex justify-between items-center"
                          onClick={() => selectFriend(friend)}
                        >
                          <p className="text-black">{friend.username}</p>
                          {taskForm.assigneeId === friend._id && (
                            <span className="text-teal-400">Selected</span>
                          )}
                        </li>
                      );
                    })}
                    {filteredFriends.length === 0 && (
                      <p className="text-gray-500 text-center p-3">No friends found.</p>
                    )}
                  </ul>
                )}
              </div>
              {taskForm.assigneeName && (
                <p className="text-teal-400 mb-4">Assigning to: {taskForm.assigneeName}</p>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                  onClick={() => setTaskModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
                  onClick={assignTask}
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}