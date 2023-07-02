import express from "express";
import AuthRouter from "./authRoutes.js";
import UserRouter from "./userRoutes.js";
import ChatRouter from "./chatRoutes.js";

const Routes = express.Router();

Routes.use("/auth", AuthRouter);
Routes.use("/users", UserRouter);
Routes.use("/chats", ChatRouter);

export default Routes;
