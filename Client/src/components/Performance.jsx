import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function Performance() {
  const [completedTasks, setCompletedTasks] = useState(0);
  const [incompleteTasks, setIncompleteTasks] = useState(0);
  const [loading, setLoading] = useState(true);

  // Function to fetch data (simulate an API call)
  const fetchData = async () => {
    setLoading(true);
    // Simulate API call with a delay
    setTimeout(() => {
      const completed = Math.floor(Math.random() * 100); // Random data for demo
      const incomplete = 100 - completed;
      setCompletedTasks(completed);
      setIncompleteTasks(incomplete);
      setLoading(false);
    }, 1000);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Chart data
  const data = {
    labels: ["Completed", "Incomplete"],
    datasets: [
      {
        data: [completedTasks, incompleteTasks],
        backgroundColor: ["#4CAF50", "#F44336"], // Green for completed, Red for incomplete
        hoverBackgroundColor: ["#66BB6A", "#EF5350"],
        borderWidth: 1,
      },
    ],
  };

  // Chart options with animations
  const options = {
    responsive: true,
    animation: {
      duration: 1000, // Animation duration in milliseconds
      easing: "easeInOutQuad", // Smooth easing function
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-20">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mb-20"> {/* Added mb-20 for margin at the bottom */}
        <h1 className="text-3xl font-bold text-center mb-6">Your Performance</h1>
        {loading ? (
          <p className="text-center text-gray-700">Loading...</p>
        ) : (
          <>
            {/* Pie Chart */}
            <div className="w-full md:w-3/4 mx-auto">
              <Pie data={data} options={options} />
            </div>

            {/* Performance Summary */}
            <div className="mt-6 text-center">
              <p className="text-gray-700">
                You have completed{" "}
                <span className="text-green-500 font-bold">{completedTasks}%</span> of your activities.
              </p>
              <p className="text-gray-700">
                <span className="text-red-500 font-bold">{incompleteTasks}%</span> of your activities are still incomplete.
              </p>
            </div>
          </>
        )}

        {/* Refresh Button */}
        <button
          onClick={fetchData}
          className="mt-6 w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
}

export default Performance;