import { ObjectId } from 'mongodb'

interface CommentType {
  _id?: ObjectId
  perfumeId: ObjectId
  userId: ObjectId
  rating: number
  content: string
}
export default class Comment {
  _id?: ObjectId
  perfumeId: ObjectId
  userId: ObjectId
  rating: number
  content: string
  constructor({ _id, perfumeId, userId, rating, content }: CommentType) {
    this._id = _id || new ObjectId()
    this.perfumeId = perfumeId
    this.userId = userId
    this.rating = rating
    this.content = content
  }
}
