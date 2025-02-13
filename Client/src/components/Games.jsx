import React, { useState } from "react";

function Games() {
  const [currentGame, setCurrentGame] = useState(null);

  // Tic-Tac-Toe Game
  const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);

    const calculateWinner = (squares) => {
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6], // Diagonals
      ];
      for (let line of lines) {
        const [a, b, c] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
        }
      }
      return null;
    };

    const handleClick = (index) => {
      if (board[index] || calculateWinner(board)) return;
      const newBoard = board.slice();
      newBoard[index] = isXNext ? "X" : "O";
      setBoard(newBoard);
      setIsXNext(!isXNext);
    };

    const winner = calculateWinner(board);
    const status = winner
      ? `Winner: ${winner}`
      : board.every((square) => square)
      ? "Draw!"
      : `Next Player: ${isXNext ? "X" : "O"}`;

    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Tic-Tac-Toe</h2>
        <div className="grid grid-cols-3 gap-2 w-48 mx-auto">
          {board.map((square, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className="w-12 h-12 bg-gray-200 flex items-center justify-center text-xl font-bold"
            >
              {square}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xl">{status}</p>
        <button
          onClick={() => setBoard(Array(9).fill(null))}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Reset
        </button>
      </div>
    );
  };

  // Rock-Paper-Scissors Game
  const RockPaperScissors = () => {
    const [playerChoice, setPlayerChoice] = useState(null);
    const [computerChoice, setComputerChoice] = useState(null);
    const [result, setResult] = useState("");

    const choices = ["Rock", "Paper", "Scissors"];

    const playGame = (choice) => {
      const computer = choices[Math.floor(Math.random() * 3)];
      setPlayerChoice(choice);
      setComputerChoice(computer);

      if (choice === computer) {
        setResult("It's a draw!");
      } else if (
        (choice === "Rock" && computer === "Scissors") ||
        (choice === "Paper" && computer === "Rock") ||
        (choice === "Scissors" && computer === "Paper")
      ) {
        setResult("You win!");
      } else {
        setResult("You lose!");
      }
    };

    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Rock-Paper-Scissors</h2>
        <div className="flex space-x-4 justify-center">
          {choices.map((choice) => (
            <button
              key={choice}
              onClick={() => playGame(choice)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              {choice}
            </button>
          ))}
        </div>
        {playerChoice && (
          <div className="mt-4">
            <p>Your choice: {playerChoice}</p>
            <p>Computer's choice: {computerChoice}</p>
            <p className="text-xl font-bold">{result}</p>
          </div>
        )}
      </div>
    );
  };

  // Number Guessing Game
  const NumberGuessingGame = () => {
    const [targetNumber] = useState(Math.floor(Math.random() * 100) + 1);
    const [guess, setGuess] = useState("");
    const [message, setMessage] = useState("");

    const handleGuess = () => {
      const num = parseInt(guess, 10);
      if (num === targetNumber) {
        setMessage("Congratulations! You guessed it right!");
      } else if (num < targetNumber) {
        setMessage("Too low! Try again.");
      } else {
        setMessage("Too high! Try again.");
      }
    };

    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Number Guessing Game</h2>
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg"
          placeholder="Enter your guess"
        />
        <button
          onClick={handleGuess}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Guess
        </button>
        {message && <p className="mt-4 text-xl">{message}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-5">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Games</h1>
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setCurrentGame("TicTacToe")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Play Tic-Tac-Toe
        </button>
        <button
          onClick={() => setCurrentGame("RockPaperScissors")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Play Rock-Paper-Scissors
        </button>
        <button
          onClick={() => setCurrentGame("NumberGuessingGame")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Play Number Guessing Game
        </button>
      </div>

      {currentGame === "TicTacToe" && <TicTacToe />}
      {currentGame === "RockPaperScissors" && <RockPaperScissors />}
      {currentGame === "NumberGuessingGame" && <NumberGuessingGame />}
    </div>
  );
}

export default Games;