import express from "express";
import Auth from "../controllers/auth.js";

const AuthRouter = express.Router();

AuthRouter.post("/sign-up", Auth.signUp);
AuthRouter.post("/sign-in", Auth.signIn);

export default AuthRouter;
