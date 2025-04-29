/**
 * @file ChatBot.tsx
 * @author Naira Mohammed Farouk
 * @summary
 *  This component renders a floating chatbot interface called "ToTaskyGPT".
 *  It allows users to send messages to a backend chatbot (Gemini API) via WebSocket
 *  and receive real-time responses.
 *
 * @version 1.0.0
 * @date 2025-04-29
 */


import { useEffect, useState } from "react";
import socket from "../config/socket";
import ReactMarkdown from "react-markdown";


type Message = {
  text: string;
  isUser: boolean;
};

/**
 * @description
 * ChatBot component provides a user-friendly chat interface fixed at the bottom right of the screen.
 * It enables communication with the Gemini backend service via WebSocket. Key features include:
 * 
 * - Toggleable floating chat window.
 * - Message sending via the `ask-gemini` WebSocket event.
 * - Real-time AI responses using the `gemini-response` event.
 * - Live typing indicator while the Gemini model processes the input.
 * - Markdown rendering for Gemini responses using `ReactMarkdown`.
 * 
 * @returns {JSX.Element} - Interactive floating chatbot widget.
 * 
 * @example
 * // Add this to your main layout or App component
 * <ChatBot />
 */
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  /**
 * @function TypingIndicator
 * @description
 *  Renders a simple animated "Typing..." indicator while waiting for Gemini response.
 *  Cycles through dots every 500ms.
 * 
 * @returns {JSX.Element} - Visual typing feedback element.
 */

  const TypingIndicator = () => {
    const [dots, setDots] = useState("");
  
    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 500);
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      <span className="italic opacity-70">Typing{dots}</span>
    );
  };

  useEffect(() => {
    socket.on("gemini-response", ({ response }) => {
      setMessages((prev) => {
        const updated = [...prev];
        if (isTyping) {
          updated[updated.length - 1] = { text: response, isUser: false };
        } else {
          updated.push({ text: response, isUser: false });
        }
        return updated;
      });
      setIsTyping(false);
    });
  
    return () => {
      socket.off("gemini-response");
    };
  }, [isTyping]);
  
  

  /**
 * @function sendMessage
 * @description
 *  Handles sending user input to the Gemini backend. Appends the user's message
 *  and a temporary bot placeholder message to the chat. Sends the message via WebSocket
 *  and resets input field.
 * 
 * @returns {void}
 */

  
  const sendMessage = () => {
    if (!userInput.trim()) return;
  
    const newMessages = [
      ...messages,
      { text: userInput, isUser: true },
      { text: "", isUser: false }
    ];
    setMessages(newMessages);
    setIsTyping(true);
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
                {/* {msg.text === "" && !msg.isUser ? <TypingIndicator /> : msg.text} */}
                {msg.text === "" && !msg.isUser ? (
                  <TypingIndicator />
                ) : msg.isUser ? (
                  msg.text
                ) : (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                )}
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
