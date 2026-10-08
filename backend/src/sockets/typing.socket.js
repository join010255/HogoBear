import { onlineUsers } from "./presence.socket.js";

export const handleTyping = (io, socket) => {
    socket.on("typing_start", (payload) => {
        const receiverSocketId = onlineUsers.get(payload.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("user_typing", {
                userId: socket.userId,
                conversationId: payload.conversationId
            });
        }
    });

    socket.on("typing_stop", (payload) => {
        const receiverSocketId = onlineUsers.get(payload.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("user_stopped_typing", {
                userId: socket.userId,
                conversationId: payload.conversationId
            });
        }
    });
};
