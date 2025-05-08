/**
 * @file ChatBot.tsx
 * @author Naira Mohammed Farouk
 * @summary
 *  This component renders a floating chatbot interface called "ToTaskyGPT".
 *  It allows users to send messages to a backend chatbot (Gemini API) via WebSocket
 *  and receive real-time responses.
 *
 * @version 1.1.0
 * @date 2025-05-07
 */

import { useEffect, useState, useRef } from "react";
import socket from "../config/socket";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";

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
 * - Click-outside functionality to close the chat window.
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  /**
   * @function TypingIndicator
   * @description
   *  Renders a modern animated "Typing..." indicator while waiting for Gemini response.
   *  Shows animated dots in a sleek container.
   *
   * @returns {JSX.Element} - Visual typing feedback element.
   */
  const TypingIndicator = () => {
    return (
      <div className="flex items-center space-x-1">
        <span className="h-2 w-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-pulse"></span>
        <span className="h-2 w-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-pulse delay-150"></span>
        <span className="h-2 w-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-pulse delay-300"></span>
      </div>
    );
  };

  // Handle click outside to close the chat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest("[data-chat-toggle]")
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Scroll to bottom of messages whenever new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      { text: "", isUser: false },
    ];
    setMessages(newMessages);
    setIsTyping(true);
    socket.emit("ask-gemini", { message: userInput });
    setUserInput("");
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Main Chat Container */}
      {isOpen && (
        <div
          ref={chatContainerRef}
          className="fixed bottom-28 right-4 w-80 sm:w-96 max-h-[600px] bg-white dark:bg-zinc-800 shadow-2xl border border-gray-100 dark:border-zinc-700 rounded-xl flex flex-col overflow-hidden z-50 text-gray-800 dark:text-zinc-100 transition-all duration-300 ease-in-out"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 dark:from-zinc-800 dark:to-zinc-700 text-white px-5 py-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <img src="/chatbot-icon.png" alt="Bot" className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg">ToTaskyGPT</h4>
            </div>
            <button
              onClick={toggleChat}
              className="text-xl rounded-full hover:bg-white/10 w-8 h-8 flex items-center justify-center transition-colors"
              aria-label="Close chat"
            >
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/80 dark:bg-zinc-900/50 backdrop-blur-sm">
            {messages.length === 0 && (
              <div className="text-center py-8 opacity-60 italic">
                Start a conversation with ToTaskyGPT
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-sm max-w-[85%] shadow-sm ${
                    msg.isUser
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                      : "bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700"
                  }`}
                >
                  {msg.text === "" && !msg.isUser ? (
                    <TypingIndicator />
                  ) : msg.isUser ? (
                    msg.text
                  ) : (
                    <div className="prose prose-sm dark:prose-invert">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex gap-2 items-center">
            <input
              type="text"
              className="flex-1 border border-gray-200 dark:border-zinc-700 bg-white/60 dark:bg-zinc-700/60 text-gray-800 dark:text-zinc-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all"
              placeholder="Ask anything..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 dark:bg-blue-700 text-white p-2.5 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center"
              aria-label="Send message"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={toggleChat}
        data-chat-toggle="true"
        className="fixed bottom-12 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 text-white rounded-full shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-700/20 flex items-center justify-center z-50 transition-all duration-300 hover:scale-105"
        aria-label="Open chat"
      >
        <img src="/chatbot-icon.png" alt="Chat" className="w-8 h-8" />
      </button>
    </>
  );
};

export default ChatBot;
