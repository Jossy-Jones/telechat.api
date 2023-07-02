import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

import ChatEvents from "./events/chat.js";
import UserEvents from "./events/user.js";
import Routes from "./routes/index.js";
import { ValidateSocket } from "./middlewares/authenticate.js";
import { WatchChat } from "./models/chat.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Cors
app.use(cors({
    origin: ["http://localhost:3007"],
}))
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:5173/"); // update to match the domain you will make the request from
//     // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
//     next();
// });

app.use("/", Routes);

const server = createServer(app);

const io = new Server(server, {
    connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 2 * 60 * 1000,
        // whether to skip middlewares upon successful recovery
        skipMiddlewares: true,
    },
    cors: {
        origin: "http://localhost:3007",
    }
});

io.use(ValidateSocket).on("connection", (socket) => {
    // Register Handlers
    ChatEvents(io, socket);
    UserEvents(io, socket);
})

server.listen(3001, () => {
    console.log("App is listening in port 3001");
});