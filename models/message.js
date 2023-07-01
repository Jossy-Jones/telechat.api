import { DataModel } from "../database/connection.js";
import { Schema } from "mongoose";

//@Schema
const MessageSchema = {
    messageId: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
    },
    timestamp: {
        type: String,
        required: true,
    },
    sender: [{
        type: Schema.Types.ObjectId,
        ref: "users"
    }],
    chatId: {
        type: String,
        required: true
    },
    
}

const MessageModel = DataModel("messages", MessageSchema);

const CreateMessage = function(payload={}){
    return new Promise(async (resolve, reject) => {
        const message_data = typeof payload === "object" ? payload : false;
        if(message_data){
            message_data["timestamp"] = Date.now()
            const new_message = new MessageModel(message_data);
            try {
                const created = await new_message.save();
                resolve(created);
            } catch (error) {
                reject(error.message)
            }
        } else {
            reject("Invalid payload type: Expected type 'object'")
        }
    })
}

const ReadMessage = function(chatId=""){
    return new Promise(async (resolve, reject) => {
        chatId = typeof chatId === "string" && chatId.trim().length > 0 ? chatId.trim() : false;
        if(chatId){
            try {
                const chat = await MessageModel.findOne({chatId}).populate({
                    path: "sender",
                    select: ["username", "fullname"]
                });
                resolve(chat);
            } catch (error) {
                reject(error.message)
            }
        } else {
            reject("Invalid payload type: Expected type 'string'");
        }
    })
}


export {CreateMessage, ReadMessage};
