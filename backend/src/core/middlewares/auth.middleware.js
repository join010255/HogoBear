import JWT from "../utils/jwt.js";

export const requireAuth = async (req, res, next) => {
    try {
        const decoded = await JWT.verifyToken(req);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = decoded; // Contains id
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
