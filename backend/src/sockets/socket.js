import authSocket from "./auth.socket.js";
import presenceSocket from "./presence.socket.js";
import messageSocket from "./message.socket.js";
import conversationSocket from "./conversation.socket.js";

export default function setupSockets(io) {
    // 1. Middleware (Auth)
    io.use(authSocket);

    // 2. Events Handlers
    io.on("connection", (socket) => {
        // Join personal room for targeted events (e.g. user_typing, message_delivered)
        if (socket.user?.id) {
            socket.join(`user:${socket.user.id}`);
        }

        presenceSocket(io, socket);
        conversationSocket(io, socket);
        messageSocket(io, socket);
    });
}
