import { io } from "socket.io-client";
import { SOCKET_URL } from "../constants/config";
import { setSocket } from "../store/socketStore";

export function connectSocket(token) {
  const socket = io(SOCKET_URL, { autoConnect: true, auth: { token } });
  setSocket(socket);
  return socket;
}