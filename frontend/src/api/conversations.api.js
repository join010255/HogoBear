import api from "./api";

class ConversationApi {
    async getAllConversations() {
        try {
            return await api.get("/conversations/get-conversations");
        } catch (error) {
            throw error;
        }
    }

    async getConversationById(conversationId) {
        try {
            return await api.get(`/conversations/get-conversation/${conversationId}`);
        } catch (error) {
            throw error;
        }
    }

    async deleteConversation(conversationId) {
        try {
            return await api.delete(`/conversations/delete-conversation/${conversationId}`);
        } catch (error) {
            throw error;
        }
    }

    async getFriendPublicKey(friendId) {
        try {
            return await api.post("/conversations/friend-public-key", { friendId });
        } catch (error) {
            throw error;
        }
    }
}

export const getConversationById = (conversationId) => api.get(`/conversations/get-conversation/${conversationId}`);
export const getConversation = getConversationById;
export const listConversations = () => api.get("/conversations/get-conversations");

export default new ConversationApi();