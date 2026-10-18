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
                        { user_one: userId },
                        { user_two: userId }
                    ]
                }, 
                include: [
                    {
                        model: Users,
                        as: "userOne",
                        attributes: ["id", "tokenUser", "username", "publicKey", "is_online"]
                    },
                    {
                        model: Users,
                        as: "userTwo",
                        attributes: ["id", "tokenUser", "username", "publicKey", "is_online"]
                    }
                ]
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

    async getConversationById(httpReq, httpRes) {
        try {
            const conversationId = httpReq.params.id;
            const userId = httpReq.user.id;

            if (!conversationId) {
                return httpRes.status(400).json({
                    message: "Conversation ID is required"
                });
            }

            const conversation = await Conversation.findOne({
                where: {
                    id: conversationId,
                    [Op.or]: [
                        { user_one: userId },
                        { user_two: userId }
                    ]
                },
                include: [
                    {
                        model: Users,
                        as: "userOne",
                        attributes: ["id", "tokenUser", "username", "publicKey", "is_online"]
                    },
                    {
                        model: Users,
                        as: "userTwo",
                        attributes: ["id", "tokenUser", "username", "publicKey", "is_online"]
                    }
                ]
            });

            if (!conversation) {
                return httpRes.status(404).json({
                    message: "Conversation not found"
                });
            }

            const plainConv = conversation.toJSON();
            // Only provide publicKey if user is online
            if (plainConv.userOne && !plainConv.userOne.is_online) {
                plainConv.userOne.publicKey = null;
            }
            if (plainConv.userTwo && !plainConv.userTwo.is_online) {
                plainConv.userTwo.publicKey = null;
            }

            return httpRes.status(200).json({
                conversation: plainConv
            });
        } catch (error) {
            console.error("Error fetching conversation by ID:", error);
            return httpRes.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
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
    };
}

export default new ConversationService();