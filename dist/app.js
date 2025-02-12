"use strict";
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
const corsOption = {
    origin: ["http://localhost:3000", "http://192.168.10.32:5174"],
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
