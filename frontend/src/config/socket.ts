/**
 * @file socket.ts
 * @author Naira Mohammed Farouk
 * @description
 *  This file initializes Socket.IO client instance and exports it for global usage.
 *  Connects to backend Websocket server using environment variables.
 * with support for cross-origin requests and credentials.
 * 
 * @version 1.0.0
 * @date 2025-04-19
 */

import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:8000", {
  transports: ["polling"], // instead of websocket
  withCredentials: true,
});


export default socket;
