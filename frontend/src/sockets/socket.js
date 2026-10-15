import { io } from "socket.io-client";
import { SOCKET_URL } from "../constants/config";
import { setSocket } from "../store/socketStore";

export function connectSocket(token) {
  const socket = io(SOCKET_URL, {
    autoConnect: true,
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on("connect_error", (err) => {
    console.error("Global socket connection error:", err.message, `(Target: ${SOCKET_URL})`);
  });

  setSocket(socket);
  return socket;
}