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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const unlinkFiles_1 = __importDefault(require("../../utils/unlinkFiles"));
const badge_model_1 = __importDefault(require("./badge.model"));
const http_status_1 = __importDefault(require("http-status"));
const createBadge = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const badge = yield badge_model_1.default.create(data);
    if (!badge) {
        (0, unlinkFiles_1.default)(data.image);
    }
    return badge;
});
const editBadge = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const badgeData = yield badge_model_1.default.findById(id);
    if (data.image && badgeData) {
        (0, unlinkFiles_1.default)(badgeData === null || badgeData === void 0 ? void 0 : badgeData.image);
    }
    if (data.image && !badgeData) {
        (0, unlinkFiles_1.default)(data.image);
    }
    const badge = yield badge_model_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!badge) {
        throw new Error("Badge not found");
    }
    return badge;
});
const getAllBadge = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield badge_model_1.default.find({ isDeleted: false });
});
const getSingleBadge = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield badge_model_1.default.findOne({ _id: id, isDeleted: false });
});
const deleteBadge = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const badge = yield badge_model_1.default.findById(id);
    if (!badge) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Badge not found");
    }
    const deleteBadge = yield badge_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!deleteBadge) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Badge not deleted.");
    }
    return deleteBadge;
});
const BadgeService = {
    createBadge,
    getAllBadge,
    editBadge,
    getSingleBadge,
    deleteBadge,
};
exports.default = BadgeService;
