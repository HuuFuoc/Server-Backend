import { ObjectId } from 'mongodb'
import Comment from './Comment.schema'
import Brand from './Brand.schema'

interface PerfumeType {
  _id?: ObjectId
  perfumeName: string
  uri: string
  price: number
  concentration: string
  description: string
  ingredients: string
  volume: number
  targetAudience: string
  comments?: Comment[]
  brand: ObjectId | string
}
export default class Perfume {
  _id?: ObjectId
  perfumeName: string
  uri: string
  price: number
  concentration: string
  description: string
  ingredients: string
  volume: number
  targetAudience: string
  comments?: Comment[]
  brand: ObjectId
  constructor({
    _id,
    perfumeName,
    uri,
    price,
    concentration,
    description,
    ingredients,
    volume,
    targetAudience,
    comments,
    brand
  }: PerfumeType) {
    this._id = _id || new ObjectId()
    this.perfumeName = perfumeName
    this.uri = uri
    this.price = price
    this.concentration = concentration
    this.description = description
    this.ingredients = ingredients
    this.volume = volume
    this.targetAudience = targetAudience
    this.comments = comments || []
    this.brand = typeof brand === 'string' ? new ObjectId(brand) : brand
  }
}
