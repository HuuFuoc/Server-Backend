import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/containts/httpStatus'
import { COMMENTS_MESSAGES } from '~/containts/messages'
import { ErrorWithStatus } from '~/models/Error'
import { CommentReqBody } from '~/models/requests/Comment.requests'
import commentsService from '~/services/comments.services'
import { getAccessTokenPayload } from '~/utils/jwt'
export const getAllCommentsController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const result = await commentsService.getAllComments()
  if (!result) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: COMMENTS_MESSAGES.GET_ALL_COMMENT_FAIL
    })
  }
  res.status(HTTP_STATUS.OK).json({
    message: COMMENTS_MESSAGES.GET_ALL_COMMENTS_SUCCESS,
    data: result
  })
}
export const postCommentController = async (
  req: Request<ParamsDictionary, any, CommentReqBody>,
  res: Response,
  next: NextFunction
) => {
  const perfumeId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  const payload = getAccessTokenPayload(req)

  const userId = payload.user_id
  const { content, rating } = req.body

  const result = await commentsService.createComment({
    content,
    rating,
    userId,
    perfumeId
  })

  res.status(HTTP_STATUS.CREATED).json({
    message: COMMENTS_MESSAGES.CREATE_COMMENT_SUCCESS,
    data: result
  })
}
