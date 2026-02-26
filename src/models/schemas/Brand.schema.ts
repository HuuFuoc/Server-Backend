import { ObjectId } from 'mongodb'

interface BrandType {
  _id?: ObjectId
  brandName: string
}
export default class Brand {
  _id?: ObjectId
  brandName: string
  constructor({ _id, brandName }: BrandType) {
    this._id = _id || new ObjectId()
    this.brandName = brandName
  }
}
