import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { USER_ROLE } from '~/containts/enums'
import HTTP_STATUS from '~/containts/httpStatus'
import { BRANDS_MESSAGES, USERS_MESSAGES } from '~/containts/messages'
import { ErrorWithStatus } from '~/models/Error'
import { addBrandReq, updateBrandReq } from '~/models/requests/Brand.requests'
import brandsService from '~/services/brands.services'
import { getAccessTokenPayload } from '~/utils/jwt'

export const getAllBrandsController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const result = await brandsService.getAllBrands()
  const { user_id, role } = getAccessTokenPayload(req)
  if (role !== USER_ROLE.Admin) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.FORBBIDEN,
      message: USERS_MESSAGES.ROLE_INVALID
    })
  }
  if (!result) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: BRANDS_MESSAGES.BRAND_NOT_FOUND
    })
  }
  res.status(HTTP_STATUS.OK).json({
    message: BRANDS_MESSAGES.GET_ALL_BRANDS_SUCCESS,
    data: result
  })
}
export const addBrandController = async (
  req: Request<ParamsDictionary, any, addBrandReq>,
  res: Response,
  next: NextFunction
) => {
  const { brandName } = req.body
  const { user_id, role } = getAccessTokenPayload(req)
  if (role !== USER_ROLE.Admin) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.FORBBIDEN,
      message: USERS_MESSAGES.ROLE_INVALID
    })
  }
  const result = await brandsService.addBrand(brandName)
  res.status(HTTP_STATUS.CREATED).json({
    message: BRANDS_MESSAGES.CREATE_BRAND_SUCCESS
  })
}
export const getBrandByIdController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { user_id, role } = getAccessTokenPayload(req)
  if (role !== USER_ROLE.Admin) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.FORBBIDEN,
      message: USERS_MESSAGES.ROLE_INVALID
    })
  }
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  const result = await brandsService.getBrandById(id)
  if (!result) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: BRANDS_MESSAGES.BRAND_NOT_FOUND
    })
  }
  res.status(HTTP_STATUS.OK).json({
    message: BRANDS_MESSAGES.GET_BRAND_SUCCESS,
    data: result
  })
}
export const updateBrandController = async (
  req: Request<ParamsDictionary, any, updateBrandReq>,
  res: Response,
  next: NextFunction
) => {
  const { user_id, role } = getAccessTokenPayload(req)
  if (role !== USER_ROLE.Admin) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.FORBBIDEN,
      message: USERS_MESSAGES.ROLE_INVALID
    })
  }
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  const { brandName } = req.body
  const result = await brandsService.updateBrand(id, brandName)
  if (!result || result.modifiedCount === 0) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: BRANDS_MESSAGES.BRAND_NOT_FOUND
    })
  }

  res.status(HTTP_STATUS.OK).json({
    message: BRANDS_MESSAGES.UPDATE_BRAND_SUCCESS,
    data: result
  })
}
export const deleteBrandController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  const { user_id, role } = getAccessTokenPayload(req)
  if (role !== USER_ROLE.Admin) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.FORBBIDEN,
      message: USERS_MESSAGES.ROLE_INVALID
    })
  }
  const result = await brandsService.deleteBrand(id)
  if (!result) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: BRANDS_MESSAGES.BRAND_NOT_FOUND
    })
  }
  res.status(HTTP_STATUS.OK).json({
    message: BRANDS_MESSAGES.DELETE_BRAND_SUCCESS
  })
}
