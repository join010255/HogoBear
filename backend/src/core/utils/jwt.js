import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import path from "path";
dotenv.config({ path: path.join(import.meta.dirname, "../../../.env") });

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
            if(!header || !header.startsWith("Bearer ")){
                return null;
            }
            const token = header.split(" ")[1];
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
}

export default new JWT();