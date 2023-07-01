import jwt from "jsonwebtoken";
import {CreateUser, ReadUser} from "../models/user.js"
import { compareCrypt, encryptString } from "../helpers/index.js";

const Auth = {
    signUp: async function _signup(req, res){
        let {fullname, username, password} = req.body
        fullname = typeof(fullname) === "string" && fullname.trim().length > 0 ? fullname.trim() : false;
        username = typeof(username) === "string" && username.trim().length > 0 ? username.trim() : false;
        password = typeof(password) === "string" && password.trim().length > 0 ? password.trim() : false;

        const error_messages = [];

        if(!fullname) error_messages.push("fullname is required");
        if(!username) error_messages.push("username is required");
        if(!password) error_messages.push("password is required");

        if(error_messages.length > 0){
            res.status(400).send({
                message: "Please fill the required fields",
                succeeded: false,
                data: null,
                error: {
                    code: "auth/invalid_parameters",
                    msg: error_messages
                }
            })
        } else {
            // Create payload
            const encrypt_password = await encryptString(password);
            const payload = {
                fullname,
                username,
                password: encrypt_password,
            }
            try {
                await CreateUser(payload);
                // Create login token
                const accessToken = jwt.sign({
                    username,
                }, process.env.Token_Secret)

                res.status(201).send({
                    message: "User created successfully",
                    succeeded: true,
                    data: {accessToken},
                    error: null,
                })
                
            } catch (error) {
                res.status(500).send({
                    message: "Could not create this user",
                    succeeded: false,
                    data: null,
                    error: {
                        code: "db/error",
                        msg: error,
                    }
                })
            }
        }
    },

    signIn: async function _signin(req, res){
        let {username, password} = req.body;
        username = typeof(username) === "string" && username.trim().length > 0 ? username.trim() : false;
        password = typeof(password) === "string" && password.trim().length > 0 ? password.trim() : false;

        const error_messages = [];

        if(!username) error_messages.push("username is required");
        if(!password) error_messages.push("password is required");

        if(error_messages.length > 0){
            res.status(400).send({
                message: "Please fill the required fields",
                succeeded: false,
                data: null,
                error: {
                    code: "auth/invalid_parameters",
                    msg: error_messages
                }
            })
        } else {
            try {
                const user = await ReadUser(username);
                const access_granted = await compareCrypt(password, user.password);
                if(access_granted){
                    const accessToken = jwt.sign({
                        username,
                    }, process.env.Token_Secret)
                    res.status(200).send({
                        message: "success",
                        data: {
                            accessToken,
                        }, //send token
                        succeeded: true,
                        error: null,
                    })
                } else {
                    res.status(400).send({
                        message: "Incorrect username or password",
                        succeeded: false,
                        data: null,
                        error: null,
                    })
                }
            } catch (error) {
                res.status(400).send({
                    message: "There is no user with this username",
                    succeeded: false,
                    data: null,
                    error: {
                        code: "db/error",
                        msg: error,
                    }
                })
            }
        }

    }
}

export default Auth