import Conversation from "../modules/conversations/conversation.model.js";

const messageSocket = (io, socket) => {
    const handleSendMessage = async (data) => {
        try {
            const conversationId = data?.conversationId || data?.conversation_id;
            const payload = data?.payload !== undefined ? data?.payload : data?.content;
            const tempId = data?.tempId || Date.now().toString();
            let recipientId = data?.recipientId;
            const userId = socket.user?.id;

            if (!conversationId || payload === undefined) {
                return socket.emit("error", {
                    message: "conversationId and payload are required"
                });
            }

            const conversation = await Conversation.findByPk(conversationId);
            if (!conversation) {
                return socket.emit("error", {
                    message: "Conversation not found"
                });
            }

            // Verify sender is participant (using user_one & user_two)
            if (conversation.user_one !== userId && conversation.user_two !== userId) {
                return socket.emit("error", {
                    message: "You are not allowed in this conversation"
                });
            }

            // Determine recipient if not provided
            if (!recipientId) {
                recipientId = conversation.user_one === userId ? conversation.user_two : conversation.user_one;
            }

            const messageData = {
                tempId,
                messageId: `${conversationId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                conversationId,
                senderId: userId,
                recipientId,
                payload,
                timestamp: new Date().toISOString()
            };

            // 1. Acknowledge receipt to sender (single tick ✓)
            socket.emit("message_sent_ack", {
                tempId,
                messageId: messageData.messageId,
                conversationId,
                status: "sent",
                timestamp: messageData.timestamp
            });

            // 2. Relay to conversation room (peer will receive)
            socket.to(`conversation:${conversationId}`).emit("receive_message", messageData);

            // Backward-compatibility
            socket.to(`conversation:${conversationId}`).emit("message:new", {
                conversation_id: conversationId,
                sender_id: userId,
                content: payload
            });
        } catch (error) {
            console.error("Error sending message:", error);
            socket.emit("error", {
                message: "Server Error"
            });
        }
    };

    // Support both hook and legacy event names
    socket.on("send_message", handleSendMessage);
    socket.on("message:send", handleSendMessage);

    // Delivery ACK (double tick ✓✓)
    socket.on("message_delivered_ack", (data) => {
        const { messageId, senderId } = data || {};
        if (messageId && senderId) {
            io.to(`user:${senderId}`).emit("message_delivered", {
                messageId,
                deliveredTo: socket.user?.id,
                timestamp: new Date().toISOString()
            });
        }
    });

    // Typing indicators
    socket.on("typing_start", (data) => {
        const { conversationId, recipientId } = data || {};
        const userId = socket.user?.id;
        const typingData = { userId, conversationId, isTyping: true };

        if (conversationId) {
            socket.to(`conversation:${conversationId}`).emit("user_typing", typingData);
        } else if (recipientId) {
            socket.to(`user:${recipientId}`).emit("user_typing", typingData);
        }
    });

    socket.on("typing_stop", (data) => {
        const { conversationId, recipientId } = data || {};
        const userId = socket.user?.id;
        const typingData = { userId, conversationId, isTyping: false };

        if (conversationId) {
            socket.to(`conversation:${conversationId}`).emit("user_typing", typingData);
        } else if (recipientId) {
            socket.to(`user:${recipientId}`).emit("user_typing", typingData);
        }
    });

    // Offline pending messages sync ack (graceful handler)
    socket.on("ack_pending_synced", (data) => {
        // Can be extended when offline storage is enabled
    });
};

export default messageSocket;