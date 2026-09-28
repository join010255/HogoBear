import FriendService from "./friend.service.js";
import { requireAuth } from "../../core/middlewares/auth.middleware.js";
import { validate } from "../../core/middlewares/validation.middleware.js";
import { friendActionSchema } from "./friend.validator.js";
import { Router } from "express";

const router = Router();

router.post("/add-friend", requireAuth, validate(friendActionSchema), FriendService.addFriend);
router.get("/get-friends", requireAuth, FriendService.getFriends);
router.put("/block-friend", requireAuth, validate(friendActionSchema), FriendService.blockFriend);
router.post("/accept-friend", requireAuth, validate(friendActionSchema), FriendService.acceptFriend);
router.get("/get-requests", requireAuth, FriendService.getFriendRequests);

export default router;