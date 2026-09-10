import { z } from "zod";

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (err) {
        return res.status(400).json({
            message: "Validation error",
            errors: err.errors,
        });
    }
};

export const createAccountSchema = z.object({
    body: z.object({
        password: z.string({
            required_error: "Password is required",
        }).min(6, "Password must be at least 6 characters long"),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        tokenUser: z.string({
            required_error: "Token user is required",
        }).regex(/^[a-f0-9]{64}$/i, "Invalid token format"),
        password: z.string({
            required_error: "Password is required",
        }).min(1, "Password cannot be empty"),
    }),
});

