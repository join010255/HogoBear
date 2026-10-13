import ConversationService from "./conversation.service.js";

class ConversationController {
    async getAllConversations(httpReq, httpRes) {
        await ConversationService.getAllConversations(httpReq, httpRes);
    }

    async deleteConversation(httpReq, httpRes){
        await ConversationService.deleteConversation(httpReq, httpRes)
    }
    async getFriendPublicKey(httpReq, httpRes) {
        await ConversationService.getFriendPublicKey(httpReq, httpRes);
    }
}
export default new ConversationController();