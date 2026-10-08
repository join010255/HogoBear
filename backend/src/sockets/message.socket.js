import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";


const messageSocket = async(io, socket) => {
    socket.io("message:send", async(data) => {
        try{
            const {conversation_id, content} = data;
            if(!conversation_id || !content){
                return socket.emit("error", {
                    message :  "conversation or content is not found"
                })
            }

            const conversation = await Conversation.findByPk(
                conversation_id
            );

            if(!conversation){
                return socket.emit("error", {
                    message : "error in conversation"
                })
            }
            const userId = socket.user.id
            if (
                conversation.client_id !== userId &&
                conversation.agent_id !== userId
            ) {
                return socket.emit("error", {
                    message: "You are not allowed"
                });
            }

            if(conversation.status === "closed"){
                return socket.emit("error", {
                    message : "conversation is closed"
                })
            }

            const message = await Message.create({
                conversation_id : conversation.id,
                sender_id : userId,
                content : content  
            })

            io.to(`conversation:${conversation.id}`).emit("message:new", {
                message
            })
        }catch(error){
            console.error(error);
            socket.emit("error", {
                message :"Server Error"
            });
        }
    })
}

export default messageSocket;