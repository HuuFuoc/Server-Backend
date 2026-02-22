import bcrypt from 'bcryptjs' // Thêm dòng này
import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { loginReqBody, RegisterReqBody } from '~/models/requests/User.requests'
import { TokenType, UserVerifyStatus } from '~/containts/enums'
import { signToken } from '~/utils/jwt'
import jwt, { sign } from 'jsonwebtoken'
import { USERS_MESSAGES } from '~/containts/messages'
import HTTP_STATUS from '~/containts/httpStatus'
import { ErrorWithStatus } from '~/models/Error'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { ref } from 'node:process'
import { sendSMTPMail } from '~/utils/mailer'
class UserService {
  async register(payload: RegisterReqBody) {
    // Mã hóa mật khẩu trước khi lưu
    let user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString())
    const hashedPassword = await bcrypt.hash(payload.password, 10)
    const result = await databaseService.users.insertOne(
      new User({_id: user_id,
        email_verify_token,
        ...payload,
        username: `user${user_id.toString()}`,
        password: hashedPassword,
        date_of_birth: new Date(payload.date_of_birth)
     })
    )
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id.toString()),
      this.signRefreshToken(user_id.toString())
    ])
    await databaseService.refresh_tokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )
    
    const verifyUrl = `${process.env.SERVER_URL}/api/user/verify-email?email_verify_token=${email_verify_token}`

    // Gửi email xác thực
    await sendSMTPMail({
      to: payload.email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
    })

    return {
      access_token,
      refresh_token
    }
  }

  async login({ email, password }: loginReqBody) {
    const user = await databaseService.users.findOne({
      email
    })
    if (!user) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT
      })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT
      })
    }
    const user_verify = await databaseService.users.findOne({
      
    })
  if (user.verify === UserVerifyStatus.Unverified) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      message: USERS_MESSAGES.USER_NOT_VERIFIED
    })
  }
    const user_id = user._id.toString()
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
    await databaseService.refresh_tokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )
    return {
      access_token,
      refresh_token
    }
  }

  async logout(refresh_token: string) {
    await databaseService.refresh_tokens.deleteOne({ token: refresh_token })
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

  async checkRefreshToken({ user_id, refresh_token }: { user_id: string; refresh_token: string }) {
    const refreshToken = await databaseService.refresh_tokens.findOne({
      user_id: new ObjectId(user_id),
      token: refresh_token
    })
    if (!refreshToken) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID
      })
    }
    return refreshToken
  }

  async checkEmailVerifyToken({ user_id, email_verify_token }: { user_id: string; email_verify_token: string }) {
    //tìm xem user nào có sỡ hữu 2 thông tin này cùng lúc
    //nếu không có nghĩa là token hợp lệ, nếu k có nghĩa là token này đã bị thay thế
    const user = await databaseService.users.findOne({
      _id: new ObjectId(user_id), //người dùng đưa cho mình là string
      email_verify_token
    })
    //nếu không tìm được nghĩa là token này đã bị thay thế
    if (!user) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY, //422
        message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_INVALID
      })
    }
    //nếu có thì
    return user
  }

  async verifyEmail(user_id: string) {
    //gọi hàm này khi đã kiểm tra email_verify_token đúng mã
    //đúng người dùng
    //cập nhập trạng thái cho account
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      [
        {
          $set: {
            verify: UserVerifyStatus.Verified,
            email_verify_token: '',
            updated_at: '$$NOW'
          }
        }
      ]
    )
    //ký lại access và rf
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id.toString()),
      this.signRefreshToken(user_id.toString())
    ])
    //lưu  rf_token
    await databaseService.refresh_tokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )

    return {
      access_token,
      refresh_token
    }
  }

  private signEmailVerifyToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.EmailVerificationToken },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: { expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_IN as unknown as jwt.SignOptions['expiresIn'] }
    })
  }
}

const userService = new UserService()
export default userService
