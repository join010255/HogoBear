import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

class JWT {
    async generateToken(payload) {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: "1h"
        });
    }
    async verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
}

export default new JWT();