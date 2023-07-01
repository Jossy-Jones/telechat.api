import express from "express";
import AuthRouter from "./authRoutes.js";
import UserRouter from "./userRoutes.js";

const Routes = express.Router();

Routes.use("/auth", AuthRouter);
Routes.use("/users", UserRouter);

export default Routes;
