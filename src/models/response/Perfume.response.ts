import { ObjectId } from 'mongodb'
import Comment from '../schemas/Comment.schema'

export interface PerfumeListResponse {
  _id: ObjectId
  perfumeName: string
  uri: string
  price: number
  concentration: string
  volume: number
  targetAudience: string
  brand: ObjectId
}
export interface PerfumeDetailResponse {
  _id: ObjectId
  perfumeName: string
  uri: string
  price: number
  concentration: string
  description: string
  ingredients: string
  volume: number
  targetAudience: string
  brand: ObjectId
  comments: Comment[]
}
