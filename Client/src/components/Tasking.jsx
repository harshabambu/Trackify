import { useState } from "react";

const Tasking = () => {
  const [coins, setCoins] = useState(100); // Example coins

  const [tasks] = useState([
    { id: 1, name: "Web Dashboard", category: "Designing" },
    { id: 2, name: "Mobile App", category: "Shopping" },
    { id: 3, name: "Animate Illustration", category: "Designing" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-5">
      {/* Top Section: Welcome & Coins */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-10 px-5">
        <h1 className="text-4xl font-bold text-gray-800">Welcome, User!</h1>
        <div className="bg-white p-3 rounded-lg shadow-md flex items-center space-x-2">
          <span className="text-2xl">💰</span>
          <span className="text-xl font-semibold text-gray-800">{coins}</span>
        </div>
      </div>

      {/* Header Text */}
      <div className="w-full max-w-5xl text-left px-5 mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Today's Task</h2>
        <p className="text-lg text-gray-600 mt-1">Check your daily tasks and schedules</p>
      </div>

      {/* Tasks Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-5">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
            <p className="text-gray-500">{new Date().toDateString()}</p>
            <h2 className="text-xl font-semibold text-gray-800 mt-2">{task.name}</h2>
            <p className="text-gray-600">{task.category}</p>

            {/* Task Members */}
            <div className="flex items-center mt-4">
              <div className="flex -space-x-2">
                <img src="https://via.placeholder.com/32" className="w-8 h-8 rounded-full border-2 border-white" alt="User 1" />
                <img src="https://via.placeholder.com/32" className="w-8 h-8 rounded-full border-2 border-white" alt="User 2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasking;
