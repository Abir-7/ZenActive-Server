import { Types } from "mongoose";
import { Block } from "./blockList.model";

const addToBlock = async (blockId: Types.ObjectId, userId: Types.ObjectId) => {
  const block = await Block.findById(userId);
  if (!block) {
    Block.create({ blockedUser: [blockId], userId });
  } else {
    if (!block.blockedUser.includes(blockId)) {
      block.blockedUser.push(blockId);
      await block.save();
    } else {
      throw new Error("User is already blocked.");
    }
  }
  return block;
};

export const deleteFromBlock = async (
  blockId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  const block = await Block.findById(userId);
  if (!block) {
    throw new Error("Block list not found.");
  }

  const userIndex = block.blockedUser.indexOf(blockId);
  if (userIndex > -1) {
    block.blockedUser.splice(userIndex, 1);
    await block.save();
  } else {
    throw new Error("User is not in the block list.");
  }

  return block;
};

const getBlockList = async (userId: string) => {
  const friendList = await Block.findOne({ userId }).populate(" blockedUser");

  return friendList;
};

export const BlockService = {
  addToBlock,
  deleteFromBlock,
  getBlockList,
};
