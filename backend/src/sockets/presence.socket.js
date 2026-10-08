import Users from "../models/user.model.js"


const presenceSocket = (io, socket) => {
    const setOnline = async() => {
        try {
            await Users.update(
                {
                    is_online : true
                
                },
                {
                    where : {
                        id : socket.user.id
                    } 
                }
            );

            io.emit("presence:update", {
                userId : socket.user.id,
                isOnline : true
            })
        } catch (error) {
            console.error(error)
        }
    }

    const setOffline = async() => {
        try{
            await Users.update(
                {
                    is_online : false
                },
                {
                    where : {
                        id : socket.user.id
                    }
                }
            )

            io.emit("presence:update", {
                userId : socket.user.id,
                isOnline : true
            })
        }catch(error){
            console.error(error)
        }
    }

    setOnline()
    io.on("diconnect", setOffline())
}

export default presenceSocket;