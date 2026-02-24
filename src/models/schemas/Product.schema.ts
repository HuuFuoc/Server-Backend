import { ObjectId } from 'mongodb'
import Review from './Review.schema'

interface ProductType {
  _id?: ObjectId
  handbagName: string
  cost: number
  category: string
  color: string[]
  gender: boolean
  uri: string
  brand: string
  percentOff: number
  reviews?: Review[]
}

export default class Product {
  _id?: ObjectId
  handbagName: string
  cost: number
  category: string
  color: string[]
  gender: boolean
  uri: string
  brand: string
  percentOff: number
  reviews?: Review[]
  constructor({ _id, handbagName, cost, category, color, gender, uri, brand, percentOff, reviews }: ProductType) {
    this._id = _id || new ObjectId()
    this.handbagName = handbagName
    this.cost = cost
    this.category = category
    this.color = color
    this.gender = gender
    this.uri = uri
    this.brand = brand
    this.percentOff = percentOff
    this.reviews = reviews || []
  }
}
