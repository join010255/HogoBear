import Users from "../modules/users/user.model.js";


const presenceSocket = (io, socket) => {
    const userId = socket.user?.id;
    if (!userId) return;

    const setOnline = async () => {
        try {
            await Users.update(
                { is_online: true },
                { where: { id: userId } }
            );

            // Hook compatible event
            io.emit("user_online", { userId });
            // Backward-compatible event
            io.emit("presence:update", { userId, isOnline: true });
        } catch (error) {
            console.error("Error setting online:", error);
        }
    };

    const setOffline = async () => {
        try {
            await Users.update(
                { is_online: false },
                { where: { id: userId } }
            );

            // Hook compatible event
            io.emit("user_offline", { userId });
            // Backward-compatible event
            io.emit("presence:update", { userId, isOnline: false });
        } catch (error) {
            console.error("Error setting offline:", error);
        }
    };

    setOnline();
    socket.on("disconnect", setOffline);
};

export default presenceSocket;