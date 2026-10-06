import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../../.env") });

const JWT_SECRET = process.env.JWT_SECRET;

class JWT {
    async generateToken(userData) {
        const payload = {
            id: userData.id,
        }
        const acessToken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: "1h"
        });
        return acessToken;
    }
    async verifyToken(token) {
        try {
            const JWT_SECRET = process.env.JWT_SECRET;
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
}

export default new JWT();