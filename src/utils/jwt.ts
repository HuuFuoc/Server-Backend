import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import { TokenPayLoad } from '~/models/requests/User.requests'
config()

export const signToken = ({
  payload,
  privateKey,
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer
  privateKey: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    // kêu jwt ký cho mình
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) throw reject(error)
      else resolve(token as string)
    })
  })
}
//Làm hàm giúp kiểm tra 1 token có đúng với chữ ký hay không
//nếu đúng thì trả ra payload đang có trong token đó
export const verifyToken = ({ token, privateKey }: { token: string; privateKey: string }) => {
  return new Promise<TokenPayLoad>((resolve, reject) => {
    jwt.verify(token, privateKey, (error, decode) => {
      if (error) throw reject(error)
      else return resolve(decode as TokenPayLoad)
    })
  })
}
