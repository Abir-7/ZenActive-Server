import { Request, Response } from "express";

import httpStatus from "http-status";
import { CommentService } from "./comment.service";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

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

// const fetchCommentsByPostId = catchAsync(
//   async (req: Request, res: Response) => {
//     const { postId } = req.params;
//     const result = await CommentService.getCommentsByPostId(postId);
//     sendResponse(res, {
//       data: result,
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Comments fetched successfully.",
//     });
//   }
// );

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
  //fetchCommentsByPostId,
  editComment,
  removeComment,
};
