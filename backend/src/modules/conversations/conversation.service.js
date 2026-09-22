import Conversation from "./conversation.model.js";
import { Op } from "sequelize";
import Users from "../users/user.model.js";

class ConversationService {
    async getAllConversations(httpReq, httpRes) {
        try {
            const userId = httpReq.user.id;
            const conversations = await Conversation.findAll({
                where: {
                    [Op.or]: [
                        { user_one: userId }
                    ]
                }, 
                include : {
                    model: Users,
                    as: "userTwo",
                    attributes: ["tokenUser", "username"]
                }
            });
            if (conversations.length === 0) {
                return httpRes.status(200).json({
                    message: "No conversations found"
                });
            }
            return httpRes.status(200).json({
                conversations
            });
        } catch (error) {
            throw error;
        }
    };

    // create conversation
    async deleteConversation(httpReq, httpRes) {
        try {
            const conversationID = httpReq.params.id;
            
            if (!conversationID) {
                return httpRes.status(400).json({
                    message: "Conversation ID is required"
                });
            }
            
            // Assuming Sequelize based on findByPk
            const conversationData = await Conversation.findByPk(conversationID);
            
            if (!conversationData) {
                return httpRes.status(404).json({
                    message: "Conversation Not Found"
                });
            }
            
            // Use .destroy() instead of .delete() for Sequelize instances
            await conversationData.destroy();

            return httpRes.status(200).json({
                message: "Conversation deleted successfully"
            });

        } catch (error) {
            console.error("Error deleting conversation:", error);
            return httpRes.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }
}

export default new ConversationService();