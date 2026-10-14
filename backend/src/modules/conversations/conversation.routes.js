import ConversationController from "./conversation.controller.js";
import { requireAuth } from "../../core/middlewares/auth.middleware.js";
import validateFriend from "./conversation.validator.js";
import { Router } from "express";

const router = Router();

router.get("/get-conversations", requireAuth, ConversationController.getAllConversations);

router.delete("/delete-conversation/:id", requireAuth, ConversationController.deleteConversation);

router.post("/friend-public-key", requireAuth, validateFriend, ConversationController.getFriendPublicKey);

export default router;