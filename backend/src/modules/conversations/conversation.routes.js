import ConversationController from "./conversation.controller.js";
import { requireAuth } from "../../core/middlewares/auth.middleware.js";
import validateFriend from "./conversation.validator.js";
import { Router } from "express";

const router = Router();

router.get("/get-conversations", requireAuth, ConversationController.getAllConversations);

router.get("/get-conversation/:id", requireAuth, ConversationController.getConversationById);
router.get("/:id", requireAuth, ConversationController.getConversationById);

router.delete("/delete-conversation/:id", requireAuth, ConversationController.deleteConversation);

export default router;