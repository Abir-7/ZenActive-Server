"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseField = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
const parseField = (fieldName) => {
    return (req, res, next) => {
        console.log(req.body[fieldName], "parse field");
        try {
            if (req.body[fieldName]) {
                req.body = JSON.parse(req.body[fieldName]);
                console.log(req.body, "parse field");
                next();
            }
            else {
                next();
            }
        }
        catch (error) {
            throw new AppError_1.default(500, "Invalid JSON string");
        }
    };
};
exports.parseField = parseField;
