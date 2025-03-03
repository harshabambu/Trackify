import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import chatIcon from "../assets/chatbot.jpeg"; // Import image properly

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI("AIzaSyC4yaO3324fq4XBJyxJ810EmBcFnIO9Jwk");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const prompt = `
        You are a productivity assistant inside a user's personal dashboard.
        You ONLY assist users with their tasks and provide encouragement.
        If the user asks about unrelated topics, politely decline.
        Always maintain a positive and motivational tone.
        
        User: ${input}
      `;

      const result = await model.generateContent(prompt);
      const botReply = result.response.text();

      const botMessage = {
        sender: "bot",
        text: botReply.includes("I can't") || botReply.includes("I'm sorry")
          ? "I am here to help you with your tasks! How can I assist you today?"
          : botReply,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again!" },
      ]);
    }

    setLoading(false);
    setInput("");
  };

  // Handle Enter Key Press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSendMessage();
    }
  };

  return (
    <div>
      {/* Floating Chat Icon */}
      <button
        className="fixed bottom-6 right-6 bg-teal-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src={chatIcon} alt="Chat Icon" className="w-10 h-10 rounded-full object-cover" />
      </button>

      {/* Chatbot Popup */}
      {isOpen && (
        <div className="fixed bottom-16 right-6 w-80 bg-white border shadow-lg rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-teal-400">Task Chatbot</h2>
            <button className="text-gray-600" onClick={() => setIsOpen(false)}>✖</button>
          </div>
          <div className="h-60 overflow-y-auto border p-2 bg-gray-100 rounded">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-teal-600 text-white self-end ml-auto"
                    : "bg-gray-300 text-black self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              className="flex-1 p-2 border rounded"
              placeholder="Ask about your tasks..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress} // Trigger send on Enter key
            />
            <button
              className="bg-teal-600 text-white px-3 py-2 rounded"
              onClick={handleSendMessage}
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
