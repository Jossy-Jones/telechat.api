import { ReadUser } from "../models/user.js";
import { AddMessage, CreateChat, ReadChat } from "../models/chat.js";
import { CreateMessage } from "../models/message.js";

const ChatEvents = (io, socket) => {
    const current_user = socket.valid_user;

    const emit_user = function (event = "chat:event", payload) {
        io.sockets.in(current_user.username).emit(event, payload)
    }

    // Join Chat
    const joinChat = async function (payload) {
        const { roomId } = payload;
        const { username } = socket.valid_user
        try {
            const user = await ReadUser(username);
            const chat_exists = await ReadChat(roomId);
            if(chat_exists){
                // check if roomId (userId) is valid
                socket.join(roomId);
                const _rooms = [...(socket.rooms)];
                if (_rooms.includes(roomId)) {
                    emit_user("chat:created", { data: roomId })
                } else {
                    emit_user("chat:error", { error: "Could not join chat" })
                }
            } else {
                emit_user("chat:error", { error: "Chat does not exist" })
            }

        } catch (error) {
            emit_user("chat:error", { error: error })
        }
    }

    // Exit a chat
    const leaveChat = function (payload) { }

    // Send Message
    const outboundMessage = async function (payload) {
        const { username } = socket.valid_user
        let { roomId, roomType, message } = payload;
        roomId = typeof roomId === "string" && roomId.trim().length > 0 ? roomId.trim() : false;
        message = typeof message === "string" && message.trim().length > 0 ? message.trim() : false;

        const errors = [];
        if(!roomId) errors.push("'roomId' is required");
        if(!message) errors.push("'message' can not be empty");

        if(errors.length > 0){
            emit_user("chat:error", { error: errors });
        } else {
            try {
                const chat = await ReadChat(roomId);
                if(chat){
                    // Create Message
                    const message_payload = {
                        content: message,
                        chatId: roomId,
                        sender: username,
                    }
                    const new_message = await CreateMessage(message_payload);
                    const messageId = (new_message._id).toString;
                    await AddMessage(roomId, messageId);

                    // Send message to client
                    io.sockets.in(roomId).emit("chat:inbound", new_message);

                    // Emit to room members
                    const _members = chat.members;
                    const room_members = _members.map((user)=>{
                        return user.username;
                    });
                    const recipients = room_members.filter(user=>user!==current_user.username)
                    recipients.map(receiver => {
                        io.sockets.in(receiver).emit("chat:inbound", new_message);
                        // Send to socket id
                        // io.sockets.socket(socketId).emit("chat:inbound", new_message)
                    });
                } else {
                    emit_user("chat:error", {error: "Chat Room does not exist, or may have been deleted"});
                }
                
            } catch (error) {
                emit_user("chat:error", { error: error })
            }
        }
    }

    // Register handlers
    socket.on("chat:join", joinChat);
    socket.on("chat:leave", leaveChat);
    socket.on("chat:outbound", outboundMessage)
}

export default ChatEvents;