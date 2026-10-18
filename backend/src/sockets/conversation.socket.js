import Conversation from "../modules/conversations/conversation.model.js";
import Users from "../modules/users/user.model.js";

const conversationSocket = (io, socket) => {
    socket.on("conversation:join", async (data) => {
        try {
            const conversationId = data?.conversation_id || data?.conversationId;
            const userId = socket.user?.id;

            if (!conversationId) {
                return socket.emit("error", {
                    message: "conversation_id is required"
                });
            }

            const conversation = await Conversation.findByPk(conversationId);
            if (!conversation) {
                return socket.emit("error", {
                    message: "Conversation not found"
                });
            }

            // Verify membership
            if (conversation.user_one !== userId && conversation.user_two !== userId) {
                return socket.emit("error", {
                    message: "Unauthorized to join this conversation"
                });
            }

            
            const roomName = `conversation:${conversationId}`;
            socket.join(roomName);

            // Fetch peer information for E2E encryption and UI
            const peerId = conversation.user_one === userId ? conversation.user_two : conversation.user_one;
            const peer = await Users.findByPk(peerId, {
                attributes: ["id", "username", "publicKey", "tokenUser", "is_online"]
            });

            // Emit peer info back to client
            socket.emit("conversation:joined", {
                conversation_id: conversationId,
                peer: peer ? {
                    id: peer.id,
                    username: peer.username,
                    publicKey: peer.publicKey,
                    tokenUser: peer.tokenUser,
                    isOnline: peer.is_online
                } : null
            });
        } catch (error) {
            console.error("Error joining conversation:", error);
            socket.emit("error", {
                message: error.message
            });
        }
    });

    socket.on("conversation:leave", (data) => {
        const conversationId = data?.conversation_id || data?.conversationId;
        if (conversationId) {
            socket.leave(`conversation:${conversationId}`);
        }
    });
};

export default conversationSocket;