import express from "express";
import path from "path";
import userRouter from "./modules/users/user.routes.js";
import frindRouter from "./modules/friends/friend.routes.js";
import conversationRouter from "./modules/conversations/conversation.routes.js";

const app = express();
app.use(express.json());

// Serve static files from the 'public' directory
app.use("/public", express.static(path.join(import.meta.dirname, "../public")));

app.use("/api/users", userRouter);
app.use("/api/friends", frindRouter);
app.use("/api/conversations", conversationRouter);
export default app;
