import JWT from "../utils/jwt.js";

export const requireAuth = async (req, res, next) => {
    const header = req.headers.authorization;
    if(!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = header.split(" ")[1];
    try {
        const decoded = await JWT.verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = decoded;
        if (!req.body) req.body = {};
        req.body.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized" 
        });
    }
};
