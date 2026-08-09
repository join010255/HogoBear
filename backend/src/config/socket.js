import { Server } from "socket.io";


let io;

const initIo = (httpServer) => {
    io = new Server(httpServer, {
        cors : {
            origin : "*",
        },
    });
    return io;
}

const getIO = () => {
    if (!io) {
        throw new Error("IO not initialized");
    }
    return io;
}

export { initIo, getIO };