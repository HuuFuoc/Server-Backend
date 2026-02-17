import bcrypt from 'bcryptjs' // Thêm dòng này
import User from '~/models/User.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { TokenType } from '~/containts/enums'
import { signToken } from '~/utils/jwt'
import jwt from 'jsonwebtoken'
class UserService {
  async register(payload: RegisterReqBody) {
    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(payload.password, 10)
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        password: hashedPassword, // Lưu mật khẩu đã mã hóa
        date_of_birth: new Date(payload.date_of_birth)
      })
    )
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id.toString()),
      this.signRefreshToken(user_id.toString())
    ])
    return {
      access_token,
      refresh_token
    }
  }
  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN as unknown as jwt.SignOptions['expiresIn'] }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN as unknown as jwt.SignOptions['expiresIn'] }
    })
  }
}

const userService = new UserService()
export default userService
