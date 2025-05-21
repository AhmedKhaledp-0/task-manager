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
import {
  faPaperPlane,
  faTimes,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import { useCreateProject, useCreateTask } from "../hooks/useApi";
import { useToast } from "../components/UI/Toast";

type Message = {
  text: string;
  isUser: boolean;
  isJson?: boolean;
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

  const { addToast } = useToast();
  const createProjectMutation = useCreateProject();
  const createTaskMutation = useCreateTask();

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
        <span className="w-2 h-2 bg-gray-400 rounded-full dark:bg-gray-300 animate-pulse"></span>
        <span className="w-2 h-2 delay-150 bg-gray-400 rounded-full dark:bg-gray-300 animate-pulse"></span>
        <span className="w-2 h-2 delay-300 bg-gray-400 rounded-full dark:bg-gray-300 animate-pulse"></span>
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

  const projectCreationRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    socket.on("gemini-response", ({ response }) => {
      setMessages((prev) => {
        const updated = [...prev];
        if (isTyping) {
          let isJson = false;
          try {
            if (
              response.trim().startsWith("{") &&
              response.trim().endsWith("}")
            ) {
              const parsedResponse = JSON.parse(response);

              const responseHash = JSON.stringify(parsedResponse);
              if (
                parsedResponse.project &&
                parsedResponse.tasks &&
                !projectCreationRef.current.has(responseHash)
              ) {
                isJson = true;

                projectCreationRef.current.add(responseHash);

                setTimeout(() => {
                  const projectData = {
                    name: parsedResponse.project.name,
                    description: parsedResponse.project.description || "",
                    status: parsedResponse.project.status,
                    priority: parsedResponse.project.priority,
                    deadline: new Date(parsedResponse.project.deadline),
                  };

                  createProjectMutation.mutate(projectData, {
                    onSuccess: (createdProject) => {
                      if (
                        parsedResponse.tasks &&
                        Array.isArray(parsedResponse.tasks)
                      ) {
                        parsedResponse.tasks.forEach(
                          (taskData: {
                            name: string;
                            description?: string;
                            status: string;
                            priority: string;
                            deadline: string;
                          }) => {
                            const newTask = {
                              name: taskData.name,
                              description: taskData.description || "",
                              status: taskData.status,
                              priority: taskData.priority,
                              deadline: new Date(taskData.deadline),
                              projectId: createdProject.id,
                            };
                            createTaskMutation.mutate(newTask);
                          }
                        );
                      }

                      // Replace JSON response with success message
                      setMessages((messages) => {
                        const updatedMessages = [...messages];
                        const lastIndex = updatedMessages.length - 1;
                        if (lastIndex >= 0) {
                          updatedMessages[lastIndex] = {
                            text: "Project created successfully with all tasks!",
                            isUser: false,
                          };
                        }
                        return updatedMessages;
                      });
                    },
                    onError: (error) => {
                      addToast({
                        type: "error",
                        title: "Error",
                        message: `Failed to create project: ${error.message}`,
                        duration: 5000,
                      });
                    },
                  });
                }, 0);
              }
            }
          } catch (e) {
            isJson = false;
          }

          updated[updated.length - 1] = {
            text: response,
            isUser: false,
            isJson,
          };
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
  }, [isTyping, createProjectMutation, createTaskMutation, addToast]);

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

  /**
   * @function useProjectCreator
   * @description
   *  Helper function that prepends "I want to create project" to user's input
   *  to trigger the project creation flow while preserving any existing input
   *
   * @returns {void}
   */
  const useProjectCreator = () => {
    const currentInput = userInput.trim();
    // If user already has text, preserve it by prepending the trigger phrase
    if (currentInput) {
      // Only prepend if the input doesn't already start with the phrase
      if (!currentInput.toLowerCase().startsWith("i want to create project")) {
        setUserInput(`I want to create project ${currentInput}`);
      }
    } else {
      // If input is empty, just set the trigger phrase
      setUserInput("I want to create project ");
    }

    // Set focus to the input field after updating
    setTimeout(() => {
      document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
    }, 0);
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
          <div className="flex items-center justify-between px-5 py-4 text-white shadow-sm bg-gradient-to-r from-blue-700 to-blue-600 dark:from-zinc-800 dark:to-zinc-700">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                <img src="/chatbot-icon.png" alt="Bot" className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold">ToTaskyGPT</h4>
            </div>
            <button
              onClick={toggleChat}
              className="flex items-center justify-center w-8 h-8 text-xl transition-colors rounded-full hover:bg-white/10"
              aria-label="Close chat"
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50/80 dark:bg-zinc-900/50 backdrop-blur-sm">
            {messages.length === 0 && (
              <>
                <div className="py-8 italic text-center opacity-60">
                  Start a conversation with ToTaskyGPT
                </div>
                <div
                  className="flex items-center justify-center px-4 py-3 text-blue-700 transition-all bg-blue-100 cursor-pointer dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/40 dark:text-blue-300 rounded-xl"
                  onClick={useProjectCreator}
                >
                  <FontAwesomeIcon icon={faRocket} className="mr-2" />
                  <span>Use AI to create a new project</span>
                </div>
              </>
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
                    <div className="prose-sm prose dark:prose-invert">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-2 p-3 bg-white border-t border-gray-100 dark:border-zinc-700 dark:bg-zinc-800">
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
              <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={toggleChat}
        data-chat-toggle="true"
        className="fixed z-50 flex items-center justify-center text-white transition-all duration-300 rounded-full shadow-lg bottom-12 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 hover:shadow-blue-500/30 dark:hover:shadow-blue-700/20 hover:scale-105"
        aria-label="Open chat"
      >
        <img src="/chatbot-icon.png" alt="Chat" className="w-8 h-8" />
      </button>
    </>
  );
};

export default ChatBot;
