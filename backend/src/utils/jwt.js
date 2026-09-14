import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

class JWT {
    async generateToken(userData) {
        const payload = {
            id : userData.id,
        }
        const acessToken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: "1h"
        });
        return acessToken;
    }
    async verifyToken(req) {
        try {
            const JWT_SECRET = process.env.JWT_SECRET;
            
            const header = req.headers.authorization;
            if(!header.startsWith("Bearer ")){
                return null;
            }
            const token = req.headers.authorization.split(" ")[1];
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
}

export default new JWT();