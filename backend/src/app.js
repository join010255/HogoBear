import express from "express";
import path from "path";
import userRouter from "./modules/users/user.routes.js";

const app = express();
app.use(express.json());

// Serve static files from the 'public' directory
app.use("/public", express.static(path.join(import.meta.dirname, "../public")));

app.use("/api/users", userRouter);
export default app;
