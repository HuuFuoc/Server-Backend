import { JwtPayload } from 'jsonwebtoken'
import { TokenType, USER_ROLE } from '~/containts/enums'
import { ParsedQs } from 'qs'
export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}
export interface loginReqBody {
  email: string
  password: string
}
export interface TokenPayLoad extends JwtPayload {
  user_id: string
  role: USER_ROLE
  token_type: TokenType
}
export interface LogoutReqBody {
  refresh_token: string
}
export interface EmailVerifyReqQuery extends ParsedQs {
  email_verify_token: string
}
export interface ChangePasswordReqBody {
  old_password: string
  new_password: string
  confirm_new_password: string
}
export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: string
}