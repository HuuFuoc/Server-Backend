import { ErrorWithStatus } from '~/models/Error'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/containts/httpStatus'
import { COMMENTS_MESSAGES } from '~/containts/messages'

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
    const existedComment = await databaseService.comments.findOne({
      userId: new ObjectId(userId),
      perfumeId: new ObjectId(perfumeId)
    })
    if (existedComment) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: COMMENTS_MESSAGES.USER_ALREADY_COMMENTED
      })
    }
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
