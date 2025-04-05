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
exports.NotificationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const notification_service_1 = require("./notification.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
// const createNotification = catchAsync(async (req: Request, res: Response) => {
//   const result = await NotificationService.createNotification(req.body);
//   sendResponse(res, {
//     data: result,
//     success: true,
//     statusCode: httpStatus.CREATED,
//     message: "Notification created successfully.",
//   });
// });
const getAllNotifications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { page = 1, limit = 20 } = req.query;
    const result = yield notification_service_1.NotificationService.getAllNotifications(userId, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        data: result.data,
        meta: result.meta,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Notifications fetched successfully.",
    });
}));
const updateNotification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield notification_service_1.NotificationService.updateNotification(id);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Notification updated successfully.",
    });
}));
const sendPushNotification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield notification_service_1.NotificationService.sendPushNotification(req.body);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Push Notification sent successfully.",
    });
}));
exports.NotificationController = {
    getAllNotifications,
    updateNotification,
    sendPushNotification,
};
