import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/containts/httpStatus'
import { PRODUCTS_MESSAGES } from '~/containts/messages'
import { ErrorWithStatus } from '~/models/Error'
import { productReqBody, updateProductReqBody } from '~/models/requests/Product.requests'
import ProductsService from '~/services/products.services'
export const getAllProductsController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const result = await ProductsService.getAllProducts()
  if (!result) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: PRODUCTS_MESSAGES.GET_ALL_PRODUCTS_FAIL
    })
  }
  res.status(HTTP_STATUS.OK).json({
    message: PRODUCTS_MESSAGES.GET_ALL_PRODUCTS_SUCCESS,
    result
  })
}
export const createProductController = async (
  req: Request<ParamsDictionary, any, productReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await ProductsService.createProduct(req.body)
  res.status(HTTP_STATUS.CREATED).json({
    message: PRODUCTS_MESSAGES.CREATE_PRODUCT_SUCCESS,
    result
  })
}
export const updateProductController = async (
  req: Request<ParamsDictionary, any, updateProductReqBody>,
  res: Response,
  next: NextFunction
) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  const result = await ProductsService.updateProduct(id, req.body)

  res.status(HTTP_STATUS.OK).json({
    message: PRODUCTS_MESSAGES.UPDATE_PRODUCT_SUCCESS,
    result
  })
}
export const getProductsByIdController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  const result = await ProductsService.getProductsById(id)
  if (!result) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND
    })
  }

  res.status(HTTP_STATUS.OK).json({
    message: PRODUCTS_MESSAGES.GET_PRODUCT_BY_ID_SUCCESS,
    result
  })
}
export const deleteProductsByIdController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  const result = await ProductsService.deleteProductsById(id)

  res.status(HTTP_STATUS.OK).json({
    message: PRODUCTS_MESSAGES.DELETE_PRODUCT_BY_ID_SUCCESS
  })
}
