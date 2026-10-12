import * as z from "zod";

// Generic Validation Middleware
export const validate = (schema) => (req, res, next) => {
    try {
        // Parse req.body directly so it works dynamically with any schema
        schema.parse(req.body);
        next();
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: "Validation error",
            errors: err.errors,
        });
    }
};

// Define your schema (z.string().uuid() instead of z.uuid())
const friendSchema = z.object({
    friendId: z.string().uuid(),
});

export default validate(friendSchema);