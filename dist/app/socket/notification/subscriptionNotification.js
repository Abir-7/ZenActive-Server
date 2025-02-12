"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNewSubscription = void 0;
const socket_1 = require("../socket");
const handleNewSubscription = (data) => {
    socket_1.io.emit("new-subscription", {
        content: {
            message: data,
            time: new Date(Date.now()),
        },
    });
};
exports.handleNewSubscription = handleNewSubscription;
