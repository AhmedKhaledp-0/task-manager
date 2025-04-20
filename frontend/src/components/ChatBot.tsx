/**
 * @file ChatBot.tsx
 * @author Naira Mohammed Farouk
 * @summary
 *  This component renders a floating chatbot interface called "ToTaskyGPT".
 *  It allows users to send messages to a backend chatbot (Gemini API) via WebSocket
 *  and receive real-time responses.
 *
 * @version 1.0.0
 * @date 2025-04-21
 */

import { useEffect, useState } from "react";
import socket from "../config/socket";

type Message = {
  text: string;
  isUser: boolean;
};

/**
 * @description
 *  ChatBot component handles:
 *  - Opening and closing the chat window.
 *  - Sending messages to the backend using the "ask-gemini" socket event.
 *  - Receiving responses from Gemini via "gemini-response" socket event.
 *  - Updating the message list and rendering both user and bot messages.
 * 
 * @returns JSX.Element - Interactive floating chatbot component.
 */

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    socket.on("gemini-response", ({ response }) => {
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
    });

    return () => {
      socket.off("gemini-response");
    };
  }, []);

  /**
   * @function sendMessage
   * @description
   *  Sends a user's message to the backend and updates the chat history.
   *  Prevents sending if the input is empty.
   */
  
  const sendMessage = () => {
    if (!userInput.trim()) return;
    const newMessages = [...messages, { text: userInput, isUser: true }];
    setMessages(newMessages);
    socket.emit("ask-gemini", { message: userInput });
    setUserInput("");
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-28 right-4 w-80 max-h-[500px] bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700 rounded-2xl flex flex-col overflow-hidden z-50 text-blue-900 dark:text-zinc-200">
          <div className="bg-blue-800 dark:bg-zinc-700 text-white px-4 py-3 flex justify-between items-center">
            <h4 className="font-semibold">ToTaskyGPT</h4>
            <button onClick={() => setIsOpen(false)} className="text-xl font-bold">×</button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 bg-gray-50 dark:bg-zinc-500">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`px-4 py-2 rounded-xl text-sm max-w-[80%] ${
                  msg.isUser
                    ? "bg-blue-100 dark:bg-blue-900 text-right self-end ml-auto"
                    : "bg-white dark:bg-zinc-700 border dark:border-zinc-600 text-left self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="p-3 border-t bg-white flex gap-2 dark:bg-zinc-500">
            <input
              type="text"
              className="flex-1 border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-800 dark:bg-blue-700 text-white px-4 py-2 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-12 right-6 w-14 h-14 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-50"
      >
        <img src="/chatbot-icon.png" alt="Chat" className="w-12 h-12" />
      </button>
    </>
  );
};

export default ChatBot;
