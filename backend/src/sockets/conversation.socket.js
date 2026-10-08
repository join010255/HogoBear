// this function is all event join users to conversation and le

const conversation =  (io, socket) => {
    socket.on("conversation:join", async(data)=>{
        try{
            const {conversation_id} = data;
            socket.join(`conversation${conversation_id}`)
            console.log("")
        }catch(error){
            io.emit("error", {
                message : error.message
            })
        }
    });

    socket.on("conversation:leave", (data) => {
        const {conversation_id} = data;
        socket.leave(`conversation${conversation_id}`)
    })
}

export default conversation;