import authSocket from "./auth.socket.js";
import presenceSocket from "./presence.socket.js";
import messageSocket from "./message.socket.js";
import conversationSocket from "./conversation.socket.js";

export default function setupSockets(io) {
    // 1. Middleware (Auth)
    io.use(authSocket);

    // 2. Events Handlers
    io.on("connection", (socket) => {
        presenceSocket(io, socket)
        conversationSocket(io, socket);
    });
}
