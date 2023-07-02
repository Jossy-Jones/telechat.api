import { AllChats, ReadChat, CreateChat } from "../models/chat.js";
import { ReadUser } from "../models/user.js";


const OpenChat = async function(req, res) {
    const current_user = req.body.user;
    let {chatId} = req.body;
    chatId = typeof chatId === "string" && chatId.trim().length > 0 ? chatId.trim() : false;

    const errors = []
    if(!chatId) errors.push("'ChatId' is required");
    
    if(errors.length > 0){
        res.status(400).send({
            message: "Please fill the required fields",
            succeeded: false,
            data: null,
            errors,
        })
    } else {
        try {
            // Check if chat exist
            const ChatData = await ReadChat(chatId);
            if(ChatData){
                console.log(ChatData)
                res.status(201).send({
                    message: "Chat created successfully",
                    succeeded: true,
                    data: ChatData,
                    errors: null,
                })
            } else {
                // Create Chat
                const participants = typeof chatId === "string" ? (chatId.split("+")) : false;
                const recipient = participants.filter(participant=>participant !== current_user.username);
                // Check if the recipient exists
                const true_recipient = await ReadUser(recipient[0]);
                if(true_recipient){
                    // Create Chat Payload
                    const chat_payload = {
                        chatId,
                        members: [true_recipient._id],
    
                    };
                    await CreateChat(chat_payload);
    
                    res.status(201).send({
                        message: "Chat created successfully",
                        succeeded: true,
                        data: chat_payload,
                        errors: null,
                    })
                } else {
                    res.status(400).send({
                        message: `Could not create chat with user: ${recipient}`,
                        succeeded: false,
                        data: null,
                        errors: ["Recipient account does not exist"]
                    })
                }
            }
        } catch (error) {
            res.status(500).send({
                message: "Could not create chat",
                succeeded: false,
                data: null,
                errors: [error]
            })
        }
    }
}

const GetChats = async function(req, res){
    let {user} = req.body;
    try {
        // Get chats
        const chats = AllChats(user);
        res.status(200).send({
            succeeded: true,
            data: chats,
            message: "Chat fetched successfully",
            errors: null
        })
        
    } catch (error) {
        res.status(400).send({
            succeeded: false,
            data: null,
            message: "Could not fetch chats",
            errors: [error]
        })
    }
}

const GetChat = async function(req,res) {
    const current_user = req.body.user;
}


export {OpenChat, GetChats, GetChat};
