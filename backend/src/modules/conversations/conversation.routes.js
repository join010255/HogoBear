import ConversationController from "./conversation.controller.js";
import { requireAuth } from "../../core/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.get("/get-conversations", requireAuth, ConversationController.getAllConversations);

export default router;