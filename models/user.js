import { Schema } from "mongoose";
import { DataModel } from "../database/connection.js";


// @Schema
const UserSchema = {
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    chats: [{
        type: Schema.Types.ObjectId,
        ref: "chats"
    }]
};

const UserModel = DataModel("users", UserSchema);

const CreateUser = function (payload = {}) {
    return new Promise(async (resolve, reject) => {
        const user_data = typeof payload === "object" ? payload : false;
        if (user_data) {
            const newUser = new UserModel(user_data);
            try {
                const created = await newUser.save();
                resolve(created);
            } catch (error) {
                reject(error.message)
            }
        } else {
            reject("Invalid payload type");
        }
    });
}

const ReadUser = function (username) {
    return new Promise(async (resolve, reject) => {
        username = typeof username === "string" && username.trim().length > 0 ? username.trim() : false;
        if (username) {
            try {
                const user = await UserModel.findOne({ username });
                resolve(user)
            } catch (error) {
                reject(error.message)
            }
        } else {
            reject("Invalid payload type")
        }
    })
}

const AllUsers = function(){
    return new Promise(async (resolve, reject) => {
        try {
            const users = await UserModel.find({});
            resolve(users);
        } catch (error) {
            reject(error.message);
        }
    })
}

export { CreateUser, ReadUser, AllUsers }
