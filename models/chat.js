import { DataModel } from "../database/connection.js";
import { Schema } from "mongoose";

import "./message.js";
import "./user.js"

//@Schema
const ChatSchema = {
    chatId: {
        type: String,
        required: true,
        unique: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: "users"
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "messages"
    }],
    last_entry: {
        type: Schema.Types.ObjectId,
        ref: "messages"
    }
    
}

const ChatModel = DataModel("chats", ChatSchema);

const CreateChat = function(payload={}){
    return new Promise(async (resolve, reject) => {
        const chat = typeof payload === "object" ? payload : false;
        if(chat){
            const new_chat = new ChatModel(chat);
            try {
                const created = await new_chat.save();
                resolve(created);
            } catch (error) {
                reject(error.message)
            }
        } else {
            reject("Invalid payload type: Expected type 'object'")
        }
    })
}

const ReadChat = function(chatId=""){
    return new Promise(async (resolve, reject) => {
        chatId = typeof chatId === "string" && chatId.trim().length > 0 ? chatId.trim() : false;
        if(chatId){
            try {
                const chat = await ChatModel.findOne({chatId}).populate([
                    {
                        path: "members",
                        select: ["username", "fullname"]
                    },
                    {
                        path: "messages",
                    }
                ]);
                resolve(chat);
            } catch (error) {
                reject(error.message)
            }
        } else {
            reject("Invalid payload type: Expected type 'string'");
        }
    })
}

const AddMessage = function(chatId,messageId) {
    return new Promise(async (resolve, reject) => {
        chatId = typeof chatId === "string" && chatId.trim().length > 0 ? chatId.trim() : false;
        messageId = typeof messageId === "string" && messageId.trim().length > 0 ? messageId.trim() : false;
        if(messageId){
            try {
                const saved = await ChatModel.findOneAndUpdate({chatId}, {
                    $push: {
                        messages: messageId,
                    }
                }, {
                    new: true
                }).populate([
                    {
                        path: "members",
                        select: ["username", "fullname"]
                    },
                    {
                        path: "messages",
                    }
                ]);

                resolve(saved);
            } catch (error) {
                reject(error.message)
            }
        } else {
            reject("Invalid payload type: Expected type 'string'");
        }
    })
}

const AllChats = function(username) {
    return new Promise(async (resolve, reject) => {
        try {
            const chats = await ChatModel.find({}).populate("last_entry");
            resolve(chats);
        } catch (error) {
            reject(error.message)
        }
    })
}

const WatchChat = function (callback) {
    const changeStream = ChatModel.watch();
    changeStream.on("change", (change)=>{
        callback(change);
    })
}


export {CreateChat, ReadChat, AllChats, AddMessage, WatchChat};
