import ConversationService from "./conversation.service.js";

class ConversationController {
    async getAllConversations(httpReq, httpRes) {
        await ConversationService.getAllConversations(httpReq, httpRes);
    }
    async deleteConversation(httpReq, httpRes){
        await ConversationService.deleteConversation(httpReq, httpRes)
    }
}
export default new ConversationController();