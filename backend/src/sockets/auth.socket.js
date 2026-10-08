import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config({
    path : "../.env"
});

const authSocket = async(socket, next) => {
    try{
        const token = socket.handshake.auth.token
        if(!token){
            return next(new Error("Token in fount"));
        };

        const decode = await jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
        );
        socket.user = decode;
        next()
    }catch(error){
        next(new Error("your token is not valide"))
    }
}

export default authSocket;