import Brand from '../schemas/Brand.schema'
import Comment from '../schemas/Comment.schema'

export interface AddPerfumeReqBody {
  perfumeName: string
  uri: string
  price: number
  concentration: string
  description: string
  ingredients: string
  volume: number
  targetAudience: string
  brand: string
}
export interface UpdatePerfumeReqBody {
  id: string
  perfumeName?: string
  uri?: string
  price?: number
  concentration?: string
  description?: string
  ingredients?: string
  volume?: number
  targetAudience?: string
  brand?: string
}
