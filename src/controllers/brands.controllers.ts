import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/containts/httpStatus'
import { BRANDS_MESSAGES } from '~/containts/messages'
import { ErrorWithStatus } from '~/models/Error'
import { addBrandReq, updateBrandReq } from '~/models/requests/Brand.requests'
import brandsService from '~/services/brands.services'

export const getAllBrandsController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const result = await brandsService.getAllBrands()
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
