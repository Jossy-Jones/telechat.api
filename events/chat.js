import { ReadUser } from "../models/user.js";
import { CreateChat } from "../models/chat.js";

const ChatEvents = (io, socket) => {
    const emit_user = function (event = "chat:event", payload) {
        const { username } = socket.valid_user;
        io.sockets.in(username).emit(event, payload)
    }


    const joinChat = async function (payload) {
        const { roomId } = payload;
        const { username } = socket.valid_user
        try {
            const chat_data = {
                chatId: roomId,
                members: []
            }
            const user = await ReadUser(username);
            console.log(user)
            chat_data.members.push(user._id)
            await CreateChat(chat_data)

            // check if roomId (userId) is valid
            socket.join(roomId);
            const _rooms = [...(socket.rooms)];
            if (_rooms.includes(roomId)) {
                emit_user("chat:created", { data: roomId })
            } else {
                emit_user("chat:error", { error: "Could not create chat" })
            }
        } catch (error) {
            emit_user("chat:error", { error: error })
        }
    }

    const leaveChat = function (payload) { }

    const outboundMessage = function (payload) {
        console.log(payload)
        const { userId, roomId, roomType, message } = payload;
        const valid_rooms = [...(socket.rooms)];
        if (!valid_rooms.includes(roomId)) return false;

        const room_members = typeof (roomId) === "string" && roomType === "personal" ? roomId.split("_") : [];

        if (room_members && room_members.length > 0) {
            if (!room_members.includes(userId)) return false;
            // Create Message
            io.sockets.in(roomId).emit("chat:inbound", { userId, message })
        }
    }

    const inboundMessage = function (payload) {
        console.log(payload)
    }


    // Register handlers
    socket.on("chat:join", joinChat);
    socket.on("chat:leave", leaveChat);
    socket.on("chat:outbound", outboundMessage)
    // socket.on("chat:inbound", inboundMessage);
}

export default ChatEvents;