"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHelper = void 0;
const socket = (io) => {
    io.on("connection", (socket) => {
        console.log("A user connected.");
        //disconnect
        socket.on("disconnect", () => {
            console.log("A user disconnected.");
        });
    });
};
exports.socketHelper = { socket };
