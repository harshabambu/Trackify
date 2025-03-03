import React, { useState, useEffect } from "react";

export default function Games() {
  const [activeTab, setActiveTab] = useState("pomodoro");

  return (
    <div className="min-h-screen bg-light flex flex-col items-center p-4 font-poppins">
      <h1 className="text-3xl font-bold mb-6 text-teal-600">Fun & Focused Games</h1>
      
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {[
          { id: "pomodoro", label: "Pomodoro Timer" },
          { id: "breathing", label: "Breathing Exercise" },
          { id: "tictactoe", label: "Tic Tac Toe" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded-lg text-white transition-all duration-300 ${
              activeTab === tab.id ? "bg-teal-400" : "bg-dark2 hover:bg-dark"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Game Components */}
      {activeTab === "pomodoro" && <Pomodoro />}
      {activeTab === "breathing" && <Breathing />}
      {activeTab === "tictactoe" && <TicTacToe />}
    </div>
  );
}

// Pomodoro Timer Component
function Pomodoro() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes !== 0) {
            setSeconds(59);
            setMinutes((prev) => prev - 1);
          } else {
            setMinutes(displayMessage ? 24 : 4);
            setSeconds(59);
            setDisplayMessage((prev) => !prev);
          }
        } else {
          setSeconds((prev) => prev - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds, minutes, displayMessage]);

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Pomodoro Timer</h2>
      <div className="text-4xl font-bold mb-4">{`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}</div>
      <div className="flex space-x-4">
        <button className="bg-teal-400 px-4 py-2 text-white rounded-lg" onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button className="bg-red-500 px-4 py-2 text-white rounded-lg" onClick={() => { setMinutes(25); setSeconds(0); setIsRunning(false); setDisplayMessage(false); }}>
          Reset
        </button>
      </div>
    </div>
  );
}

// Breathing Exercise Component
function Breathing() {
  const [phase, setPhase] = useState("Inhale");
  const [timer, setTimer] = useState(4);
  const phases = { Inhale: 4, Hold: 7, Exhale: 8 };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          setPhase((prevPhase) => (prevPhase === "Inhale" ? "Hold" : prevPhase === "Hold" ? "Exhale" : "Inhale"));
          return phases[phase === "Inhale" ? "Hold" : phase === "Hold" ? "Exhale" : "Inhale"];
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, phases]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-teal-600">{phase}</h2>
      <div className={`w-48 h-48 flex items-center justify-center text-3xl font-bold text-white bg-teal-400 rounded-full mt-4 transition-all duration-[4000ms] ${phase === "Inhale" ? "scale-125" : phase === "Exhale" ? "scale-75" : "scale-100"}`}>
        {timer}s
      </div>
    </div>
  );
}

// Tic Tac Toe Component
function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const checkWinner = () => {
    const patterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let [a, b, c] of patterns) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        return;
      }
    }
  };

  useEffect(checkWinner, [board]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold">Tic Tac Toe</h2>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {board.map((value, i) => (
          <div key={i} className="w-16 h-16 flex items-center justify-center text-2xl font-bold border-2 border-teal-400 cursor-pointer" onClick={() => { if (!board[i] && !winner) { const newBoard = [...board]; newBoard[i] = isXNext ? "X" : "O"; setBoard(newBoard); setIsXNext(!isXNext); } }}>{value}</div>
        ))}
      </div>
      {winner && <h3 className="text-xl font-bold text-teal-600 mt-4">Winner: {winner}</h3>}
      <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg" onClick={() => { setBoard(Array(9).fill(null)); setWinner(null); setIsXNext(true); }}>Reset</button>
    </div>
  );
}
