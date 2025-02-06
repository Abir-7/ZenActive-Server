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
exports.ChallegeService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const challenge_model_1 = require("./challenge.model");
const http_status_1 = __importDefault(require("http-status"));
const createChallenge = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield challenge_model_1.Challenge.create(data);
    return result;
});
const updateChallenge = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield challenge_model_1.Challenge.findById({ _id: id });
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Challange not found.");
    }
    const updatedData = yield challenge_model_1.Challenge.findOneAndUpdate({ _id: id }, data, {
        new: true,
    });
    if (!updatedData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update.");
    }
    return updatedData;
});
const getAllChallenges = () => __awaiter(void 0, void 0, void 0, function* () {
    const challenges = yield challenge_model_1.Challenge.find({ isDeleted: false });
    return challenges;
});
const getSingleChallenge = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const challenge = yield challenge_model_1.Challenge.findById(id);
    if (!challenge) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Challenge not found.");
    }
    if (challenge.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Challenge is deleted.");
    }
    return challenge;
});
const deleteChallenge = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedChallenge = yield challenge_model_1.Challenge.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } }, { new: true });
    if (!deletedChallenge) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Challenge not found.");
    }
    return { message: "Challenge deleted" };
});
exports.ChallegeService = {
    createChallenge,
    getAllChallenges,
    getSingleChallenge,
    updateChallenge,
    deleteChallenge,
};
