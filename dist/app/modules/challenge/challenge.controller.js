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
exports.ChallengeController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const challenge_service_1 = require("./challenge.service");
const http_status_1 = __importDefault(require("http-status"));
const createChallenge = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let image = null;
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    const value = Object.assign(Object.assign({}, req.body), { image });
    const result = yield challenge_service_1.ChallegeService.createChallenge(value);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Challenge created successfully.",
    });
}));
const updateChallenge = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
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
    const result = yield challenge_service_1.ChallegeService.updateChallenge(id, value);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Challenge updated successfully.",
    });
}));
const getAllChallenges = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const challenges = yield challenge_service_1.ChallegeService.getAllChallenges();
    (0, sendResponse_1.default)(res, {
        data: challenges,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Challenges fetched successfully.",
    });
}));
const getSingleChallenge = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const challenge = yield challenge_service_1.ChallegeService.getSingleChallenge(id);
    (0, sendResponse_1.default)(res, {
        data: challenge,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Challenge fetched successfully.",
    });
}));
const deleteChallenge = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedChallenge = yield challenge_service_1.ChallegeService.deleteChallenge(id);
    (0, sendResponse_1.default)(res, {
        data: deletedChallenge,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Challenge deleted successfully.",
    });
}));
exports.ChallengeController = {
    createChallenge,
    updateChallenge,
    getAllChallenges,
    getSingleChallenge,
    deleteChallenge,
};
