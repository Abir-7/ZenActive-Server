"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNewUser = void 0;
const socket_1 = require("../socket");
const handleNewUser = () => {
    socket_1.io.emit("new-user", {
        content: {
            message: `New User registered.`,
            time: new Date(Date.now()),
        },
    });
};
exports.handleNewUser = handleNewUser;
