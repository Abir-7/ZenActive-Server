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
exports.BadgeController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const badge_service_1 = __importDefault(require("./badge.service"));
const createBadge = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let image = null;
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    const value = Object.assign(Object.assign({}, req.body), { image });
    const result = yield badge_service_1.default.createBadge(value);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Badge successfully created.",
    });
}));
const editBadge = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let image = null;
    let value = null;
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    if (image) {
        value = Object.assign(Object.assign({}, req.body), { image });
    }
    else {
        value = req.body;
    }
    const result = yield badge_service_1.default.editBadge(id, value);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Badge successfully updated.",
    });
}));
const getAllBadge = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield badge_service_1.default.getAllBadge(req.query);
    (0, sendResponse_1.default)(res, {
        data: result.result,
        meta: result.meta,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Badges are successfully fetched.",
    });
}));
const getSingleBadge = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield badge_service_1.default.getSingleBadge(id);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Badge is successfully fetched.",
    });
}));
const deleteBadge = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield badge_service_1.default.deleteBadge(id);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Badge successfully deleted.",
    });
}));
exports.BadgeController = {
    createBadge,
    editBadge,
    getSingleBadge,
    getAllBadge,
    deleteBadge,
};
