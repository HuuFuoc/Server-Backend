import Brand from '../models/schemas/Brand.schema'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '../models/Error'
import HTTP_STATUS from '../constants/httpStatus'
import { BRANDS_MESSAGES } from '../constants/messages'

class BrandsService {
  async getAllBrands() {
    const result = await databaseService.brands.find().toArray()
    return result
  }
  async addBrand(brandName: string) {
    const result = await databaseService.brands.insertOne(
      new Brand({
        brandName
      })
    )
    return result
  }
  async getBrandById(id: string) {
    const result = await databaseService.brands.findOne({ _id: new ObjectId(id) })
    return result
  }
  async updateBrand(id: string, brandName?: string) {
    if (!id) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: BRANDS_MESSAGES.BRAND_ID_IS_REQUIRED
      })
    }

    if (!ObjectId.isValid(id)) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: BRANDS_MESSAGES.INVALID_BRAND_ID
      })
    }

    const brand = await databaseService.brands.findOne({
      _id: new ObjectId(id)
    })

    if (!brand) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: BRANDS_MESSAGES.BRAND_NOT_FOUND
      })
    }

    const result = await databaseService.brands.updateOne({ _id: new ObjectId(id) }, { $set: { brandName } })

    return result
  }
  async deleteBrand(id: string) {
    if (!id) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: BRANDS_MESSAGES.BRAND_ID_IS_REQUIRED
      })
    }
    if (!ObjectId.isValid(id)) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: BRANDS_MESSAGES.INVALID_BRAND_ID
      })
    }
    const result = await databaseService.brands.deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: BRANDS_MESSAGES.BRAND_NOT_FOUND
      })
    }
    return result
  }
}
const brandsService = new BrandsService()
export default brandsService
