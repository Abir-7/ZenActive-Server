import { Request, Response } from "express";

import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";

import sendResponse from "../../../utils/sendResponse";
import { CommentService } from "./comment.service";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { postId, comment } = req.body;
  const result = await CommentService.addComment({ userId, postId, comment });
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Comment successfully created.",
  });
});

const createVideoComment = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { videoId, comment } = req.body;
  const result = await CommentService.addVideoComment({
    userId,
    videoId,
    comment,
  });
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Video Comment successfully created.",
  });
});

// const fetchCommentById = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const result = await CommentService.getCommentById(id);
//   sendResponse(res, {
//     data: result,
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Comment fetched successfully.",
//   });
// });

const fetchCommentsByPostId = catchAsync(
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { page = 1, limit = 15 } = req.query;
    const result = await CommentService.getCommentsByPostId(
      postId,
      Number(page),
      Number(limit)
    );
    sendResponse(res, {
      data: result.data,
      meta: result.meta,
      success: true,
      statusCode: httpStatus.OK,
      message: "Comments fetched successfully.",
    });
  }
);

const fetchVideoCommentsByVideoId = catchAsync(
  async (req: Request, res: Response) => {
    const { videoId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const result = await CommentService.getVideoCommentsByVideoId(
      videoId,
      Number(page),
      Number(limit)
    );
    sendResponse(res, {
      data: result.data,
      meta: result.meta,
      success: true,
      statusCode: httpStatus.OK,
      message: "Comments fetched successfully.",
    });
  }
);

const editComment = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { id } = req.params;
  const updateData = req.body;
  const result = await CommentService.updateComment(id, updateData, userId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment updated successfully.",
  });
});

const removeComment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CommentService.deleteComment(id);

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment deleted successfully.",
  });
});

export const CommentController = {
  createComment,
  //fetchCommentById,
  fetchCommentsByPostId,
  editComment,
  removeComment,
  createVideoComment,
  fetchVideoCommentsByVideoId,
};
