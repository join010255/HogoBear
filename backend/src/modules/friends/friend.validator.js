import { z } from "zod";

export const friendActionSchema = z.object({
    body: z.object({
        friend_token: z.string({
            required_error: "Friend token is required",
        }).regex(/^[a-f0-9]{64}$/i, "Invalid token format"),
    }),
});
