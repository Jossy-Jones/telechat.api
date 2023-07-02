import express from "express";
import { GetAllUsers } from "../controllers/user.js";

const UserRouter = express.Router();

UserRouter.get("/all", GetAllUsers);

export default UserRouter;