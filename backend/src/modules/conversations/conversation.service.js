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

}

export default new ConversationService();