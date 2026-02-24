export interface productReqBody {
  handbagName: string
  cost: number
  category: string
  color: string[]
  gender: boolean
  uri: string
  brand: string
  percentOff: number
}
export interface updateProductReqBody {
  handbagName: string
  cost: number
  category: string
  color: string[]
  gender: boolean
  uri: string
  brand: string
  percentOff: number
}
export interface getProductByIdReqParams {
  id: string
}
export interface deleteProductByIdReqParams {
  id: string
}
