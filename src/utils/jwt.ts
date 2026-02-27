import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import { TokenPayLoad } from '~/models/requests/User.requests'
import { ErrorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/containts/httpStatus'
import { USERS_MESSAGES } from '~/containts/messages'
import { Request } from 'express'
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
export const getAccessTokenPayload = (req: Request): TokenPayLoad => {
  const payload = req.decode_authorization as TokenPayLoad

  if (!payload) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNAUTHORIZED,
      message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
    })
  }

  return payload
}
