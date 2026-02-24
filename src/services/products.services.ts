import { ErrorWithStatus } from '~/models/Error'
import databaseService from './database.services'
import HTTP_STATUS from '~/containts/httpStatus'
import { PRODUCTS_MESSAGES } from '~/containts/messages'
import { RegisterReqBody } from '~/models/requests/User.requests'
import {
  deleteProductByIdReqParams,
  getProductByIdReqParams,
  productReqBody,
  updateProductReqBody
} from '~/models/requests/Product.requests'
import Product from '~/models/schemas/Product.schema'
import { ObjectId } from 'mongodb'

class ProductsService {
  async getAllProducts() {
    const result = await databaseService.products.find({}).toArray()
    return result
  }
  async createProduct(payload: productReqBody) {
    const result = await databaseService.products.insertOne(
      new Product({
        ...payload
      })
    )
    return result
  }
  async updateProduct(id: string, updateData: updateProductReqBody) {
    if (!id) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: PRODUCTS_MESSAGES.PRODUCT_ID_IS_REQUIRED
      })
    }
    const result = await databaseService.products.updateOne({ _id: new ObjectId(id) }, { $set: { ...updateData } })

    return result
  }
  async getProductsById(id: string) {
    if (!id) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: PRODUCTS_MESSAGES.PRODUCT_ID_IS_REQUIRED
      })
    }
    if (!ObjectId.isValid(id)) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: PRODUCTS_MESSAGES.INVALID_PRODUCT_ID
      })
    }
    const result = await databaseService.products.findOne({ _id: new ObjectId(id) })

    return result
  }
  async deleteProductsById(id: string) {
    if (!id) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: PRODUCTS_MESSAGES.PRODUCT_ID_IS_REQUIRED
      })
    }
    if (!ObjectId.isValid(id)) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: PRODUCTS_MESSAGES.INVALID_PRODUCT_ID
      })
    }
    const result = await databaseService.products.deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND
      })
    }
    return result
  }
}

const productsService = new ProductsService()
export default productsService
