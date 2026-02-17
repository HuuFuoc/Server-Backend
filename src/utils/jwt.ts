import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
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
