import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config({
    path : "../.env"
});

const authSocket = async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error("Token not found"));
        }

        const secret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET;
        const decode = jwt.verify(token, secret);
        socket.user = decode;
        
        next();
    } catch (error) {
        return next(new Error("Invalid token"));
    }
};

export default authSocket;