import databaseService from './database.services'
import { ObjectId } from 'mongodb'

class CommentsService {
  async getAllComments() {
    const result = await databaseService.comments.find({}).toArray()
    return result
  }
  async createComment({
    content,
    rating,
    userId,
    perfumeId
  }: {
    content: string
    rating: number
    userId: string
    perfumeId: string
  }) {
    const newComment = {
      _id: new ObjectId(),
      content,
      rating,
      userId: new ObjectId(userId),
      perfumeId: new ObjectId(perfumeId),
      createdAt: new Date()
    }

    await databaseService.comments.insertOne(newComment)
    await databaseService.perfumes.updateOne({ _id: new ObjectId(perfumeId) }, { $push: { comments: newComment } })
    return newComment
  }
}
const commentsService = new CommentsService()
export default commentsService
