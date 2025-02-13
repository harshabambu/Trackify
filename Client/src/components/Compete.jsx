import React, { useState } from "react";

const Compete = () => {
  const [friends, setFriends] = useState([
    { id: 1, name: "Hari", points: 250 },
    { id: 2, name: "Harsha", points: 180 },
    { id: 3, name: "Mohit", points: 220 },
  ]);

  const [newFriend, setNewFriend] = useState("");
  const [newPoints, setNewPoints] = useState("");

  const addFriend = () => {
    if (newFriend && newPoints) {
      setFriends((prevFriends) =>
        [...prevFriends, { id: prevFriends.length + 1, name: newFriend, points: parseInt(newPoints) }].sort(
          (a, b) => b.points - a.points
        )
      );
      setNewFriend("");
      setNewPoints("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-5">
      <h1 className="text-4xl font-bold text-gray-800">Compete 🏆</h1>
      <p className="text-lg text-gray-600 mb-6">Compete with your friends and track performance!</p>

      {/* Add Friend Section */}
      <div className="mb-6 flex space-x-2">
        <input
          type="text"
          placeholder="Friend's Name"
          value={newFriend}
          onChange={(e) => setNewFriend(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Points"
          value={newPoints}
          onChange={(e) => setNewPoints(e.target.value)}
          className="p-2 border rounded"
        />
        <button onClick={addFriend} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </div>

      {/* Leaderboard Section */}
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Leaderboard</h2>
        <ul>
          {friends.map((friend, index) => (
            <li key={friend.id} className="flex justify-between py-2 border-b">
              <span className="font-medium">#{index + 1} {friend.name}</span>
              <span className="text-gray-600">{friend.points} pts</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Compete;
