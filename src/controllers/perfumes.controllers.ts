import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/containts/httpStatus'
import { COMMENTS_MESSAGES, PERFUME_MESSAGES, PRODUCTS_MESSAGES } from '~/containts/messages'
import { ErrorWithStatus } from '~/models/Error'
import { CommentReqBody } from '~/models/requests/Comment.requests'
import { AddPerfumeReqBody } from '~/models/requests/Perfume.requests'
import commentsService from '~/services/comments.services'
import perfumesService from '~/services/perfumes.services'
import { getAccessTokenPayload } from '~/utils/jwt'

export const getAllPerfumesController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const result = await perfumesService.getAllPerfumes()

  res.status(HTTP_STATUS.OK).json({
    message: PRODUCTS_MESSAGES.GET_ALL_PERFUMES_SUCCESS,
    data: result
  })
}
export const createPerfumeController = async (
  req: Request<ParamsDictionary, any, AddPerfumeReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await perfumesService.createPerfume(req.body)
  res.status(HTTP_STATUS.CREATED).json({
    message: PERFUME_MESSAGES.CREATE_PERFUME_SUCCESS,
    result
  })
}
export const getPerfumeDetailController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  const result = await perfumesService.getPerfumeDetail(id)
  if (!result) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: PERFUME_MESSAGES.PERFUME_NOT_FOUND
    })
  }
  res.status(HTTP_STATUS.OK).json({
    message: PRODUCTS_MESSAGES.GET_PERFUME_DETAIL_SUCCESS,
    result
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
