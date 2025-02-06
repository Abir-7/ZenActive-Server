"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = require("./app/middleware/globalErrorHandler");
const noRoute_1 = __importDefault(require("./app/middleware/noRoute"));
const routes_1 = __importDefault(require("./app/routes"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./app/modules/userChat/chat.service");
const corsOption = {
    origin: ["http://localhost:3000", "*"],
    credentials: true,
    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
};
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOption));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static("uploads"));
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/api", routes_1.default);
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(noRoute_1.default);
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["*", "http://localhost:3000"], // Allow all origins
        methods: ["GET", "POST"],
    },
});
const users = new Map();
io.on("connection", (socket) => {
    console.log("connected");
    socket.on("register", (userId) => {
        users.set(userId, socket.id);
        console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    });
    socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const receiverSocketId = users.get(data.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", {
                senderId: data.senderId,
                receiverId: data.receiverId,
                content: data.message,
            });
        }
        yield chat_service_1.ChatService.createChat(data);
    }));
    socket.on("disconnect", () => {
        // Remove user from the mapping when they disconnect
        users.forEach((socketId, userId) => {
            if (socketId === socket.id) {
                users.delete(userId);
                console.log(`User ${userId} disconnected`);
            }
        });
    });
});
