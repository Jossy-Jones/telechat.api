import express from "express";
import {OpenChat, GetChats} from "../controllers/chat.js";
import { ValidateToken } from "../middlewares/authenticate.js";

const ChatRouter = express.Router();

ChatRouter.get("/personal", [ValidateToken, OpenChat])
ChatRouter.get("/all", [ValidateToken, GetChats])

export default ChatRouter;