import bcrypt from 'bcryptjs' // Thêm dòng này
import User from '../models/schemas/User.schema'
import databaseService from './database.services'
import { loginReqBody, RegisterReqBody, UpdateMeReqBody } from '../models/requests/User.requests'
import { TokenType, USER_ROLE, UserVerifyStatus } from '../constants/enums'
import { signToken } from '../utils/jwt'
import jwt, { sign } from 'jsonwebtoken'
import { USERS_MESSAGES } from '../constants/messages'
import HTTP_STATUS from '../constants/httpStatus'
import { ErrorWithStatus } from '../models/Error'
import RefreshToken from '../models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { ref } from 'node:process'
import { sendSMTPMail } from '../utils/mailer'
class UserService {
  async register(payload: RegisterReqBody) {
    // Mã hóa mật khẩu trước khi lưu
    let user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString(), USER_ROLE.User)
    const hashedPassword = await bcrypt.hash(payload.password, 10)
    const role = USER_ROLE.User
    const result = await databaseService.users.insertOne(
      new User({
        _id: user_id,
        email_verify_token,
        ...payload,
        username: `user${user_id.toString()}`,
        password: hashedPassword,
        date_of_birth: new Date(payload.date_of_birth),
        role
      })
    )
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id.toString(), role),
      this.signRefreshToken(user_id.toString(), role)
    ])
    await databaseService.refresh_tokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )

    const verifyUrl = `${process.env.SERVER_URL}/verify-email?email_verify_token=${email_verify_token}`

    // Gửi email xác thực
    await sendSMTPMail({
      to: payload.email,
      subject: 'Confirm Your Email Address',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
</head>
<body style="margin:0;padding:0;background-color:#ffe8d6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffe8d6;padding:40px 16px;">
    <tr>
      <td align="center">
        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.08);overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg,#ddbea9 0%,#cb997e 100%);padding:40px 32px 32px;">
              <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:50%;display:inline-block;line-height:56px;font-size:28px;text-align:center;">✉</div>
              <h1 style="margin:16px 0 0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.3px;">Verify Your Email</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.6;">Hi there,</p>
              <p style="margin:0 0 28px;color:#374151;font-size:16px;line-height:1.6;">
                Welcome! We're glad you're here. To get started, please confirm your email address by clicking the button below.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <a href="${verifyUrl}"
                       target="_blank"
                       style="display:inline-block;background:linear-gradient(135deg,#ddbea9 0%,#cb997e 100%);color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:8px;letter-spacing:0.3px;">
                      ✔ &nbsp;Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry note -->
              <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;text-align:center;">
                This link will expire in <strong>24 hours</strong>.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #ddbea9;margin:0 0 24px;" />

              <!-- Fallback link -->
              <p style="margin:0 0 8px;color:#6b7280;font-size:13px;line-height:1.6;">
                If the button above doesn't work, copy and paste the link below into your browser:
              </p>
              <p style="margin:0;word-break:break-all;">
                <a href="${verifyUrl}" style="color:#cb997e;font-size:13px;text-decoration:underline;">${verifyUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Security Note -->
          <tr>
            <td style="background-color:#ede0d4;padding:20px 40px;border-top:1px solid #ddbea9;">
              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;text-align:center;">
                🔒 &nbsp;If you did not create an account with us, you can safely ignore this email — no action is required.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;background-color:#ede0d4;">
              <p style="margin:0;color:#cb997e;font-size:12px;text-align:center;">
                © ${new Date().getFullYear()} Your App Name &nbsp;·&nbsp; All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
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

    if (user.verify === UserVerifyStatus.Unverified) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: USERS_MESSAGES.USER_NOT_VERIFIED
      })
    }
    const user_id = user._id.toString()
    const role = user.role
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id, role),
      this.signRefreshToken(user_id, role)
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

  private signAccessToken(user_id: string, role: USER_ROLE) {
    return signToken({
      payload: { user_id, role, token_type: TokenType.AccessToken },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN as unknown as jwt.SignOptions['expiresIn'] }
    })
  }

  private signRefreshToken(user_id: string, role: USER_ROLE) {
    return signToken({
      payload: { user_id, role, token_type: TokenType.RefreshToken },
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
    const user = await databaseService.users.findOne({
      _id: new ObjectId(user_id)
    })

    if (!user) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: USERS_MESSAGES.USER_NOT_FOUND
      })
    }

    const role = user.role

    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id.toString(), role),
      this.signRefreshToken(user_id.toString(), role)
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

  private signEmailVerifyToken(user_id: string, role: USER_ROLE) {
    return signToken({
      payload: { user_id, role, token_type: TokenType.EmailVerificationToken },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: { expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_IN as unknown as jwt.SignOptions['expiresIn'] }
    })
  }

  async changePassword(user_id: string, old_password: string, new_password: string) {
    const user = await databaseService.users.findOne({
      _id: new ObjectId(user_id)
    })
    if (!user) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: USERS_MESSAGES.USER_NOT_FOUND
      })
    }
    const isPasswordMatch = await bcrypt.compare(old_password, user.password)
    if (!isPasswordMatch) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: USERS_MESSAGES.PASSWORD_IS_WRONG
      })
    }
    const hashedPassword = await bcrypt.hash(new_password, 10)

    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hashedPassword,
          updated_at: new Date()
        }
      }
    )
  }

  async getMe(user_id: string) {
    const user = await databaseService.users.findOne({
      _id: new ObjectId(user_id)
    })
    if (!user) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: USERS_MESSAGES.USER_NOT_FOUND
      })
    }
    if (!ObjectId.isValid(user_id)) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: USERS_MESSAGES.INVALID_USER_ID
      })
    }
    return user
  }

  async updateMe(user_id: string, payload: UpdateMeReqBody) {
    const user = await databaseService.users.findOne({
      _id: new ObjectId(user_id)
    })
    if (!user) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: USERS_MESSAGES.USER_NOT_FOUND
      })
    }
    if (!ObjectId.isValid(user_id)) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: USERS_MESSAGES.INVALID_USER_ID
      })
    }

    // Chỉ cập nhật những field user gửi lên (tất cả đều optional)
    const updateData: Record<string, unknown> = {
      updated_at: new Date()
    }
    if (payload.name !== undefined) {
      updateData.name = payload.name
    }
    if (payload.date_of_birth !== undefined) {
      updateData.date_of_birth = new Date(payload.date_of_birth)
    }

    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      { $set: updateData }
    )

    const updatedUser = await databaseService.users.findOne({
      _id: new ObjectId(user_id)
    })
    return updatedUser
  }
}

const userService = new UserService()
export default userService
