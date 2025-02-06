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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockService = exports.deleteFromBlock = void 0;
const blockList_model_1 = require("./blockList.model");
const addToBlock = (blockId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const block = yield blockList_model_1.Block.findById(userId);
    if (!block) {
        blockList_model_1.Block.create({ blockedUser: [blockId], userId });
    }
    else {
        if (!block.blockedUser.includes(blockId)) {
            block.blockedUser.push(blockId);
            yield block.save();
        }
        else {
            throw new Error("User is already blocked.");
        }
    }
    return block;
});
const deleteFromBlock = (blockId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const block = yield blockList_model_1.Block.findById(userId);
    if (!block) {
        throw new Error("Block list not found.");
    }
    const userIndex = block.blockedUser.indexOf(blockId);
    if (userIndex > -1) {
        block.blockedUser.splice(userIndex, 1);
        yield block.save();
    }
    else {
        throw new Error("User is not in the block list.");
    }
    return block;
});
exports.deleteFromBlock = deleteFromBlock;
const getBlockList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const friendList = yield blockList_model_1.Block.findOne({ userId }).populate(" blockedUser");
    return friendList;
});
exports.BlockService = {
    addToBlock,
    deleteFromBlock: exports.deleteFromBlock,
    getBlockList,
};
