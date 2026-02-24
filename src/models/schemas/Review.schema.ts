import { ObjectId } from 'mongodb'

interface ReviewType {
  _id?: ObjectId
  productId: ObjectId
  userId: ObjectId
  rating: number
  comment: string
}
export default class Review {
  _id?: ObjectId
  productId: ObjectId
  userId: ObjectId
  rating: number
  comment: string
  constructor({ _id, productId, userId, rating, comment }: ReviewType) {
    this._id = _id || new ObjectId()
    this.productId = productId
    this.userId = userId
    this.rating = rating
    this.comment = comment
  }
}
