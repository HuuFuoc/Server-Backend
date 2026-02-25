import { NextFunction, Request, Response } from 'express'
import userService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  ChangePasswordReqBody,
  EmailVerifyReqQuery,
  loginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  TokenPayLoad
} from '~/models/requests/User.requests'
import { ErrorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/containts/httpStatus'
import { USERS_MESSAGES } from '~/containts/messages'
import { UserVerifyStatus } from '~/containts/enums'

export const loginController = async (
  req: Request<ParamsDictionary, any, loginReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body
  const result = await userService.login({ email, password })
  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body

  const isDup = await userService.checkEmailExist(email)
  if (isDup) {
    throw new ErrorWithStatus({
      message: 'Email already exists',
      status: 422
    })
  }

  const result = await userService.register(req.body)
  return res.status(200).json({
    message: 'Register successful',
    result
  })
}
export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  const { user_id: user_id_at } = req.decode_authorization as TokenPayLoad
  const { user_id: user_id_rf } = req.decode_refresh_token as TokenPayLoad
  if (user_id_at !== user_id_rf) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNAUTHORIZED,
      message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID
    })
  }
  await userService.checkRefreshToken({
    user_id: user_id_at,
    refresh_token
  })
  await userService.logout(refresh_token)
  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGOUT_SUCCESS
  })
}
export const emailVerifyController = async (
  req: Request<ParamsDictionary, any, any, EmailVerifyReqQuery>,
  res: Response,
  next: NextFunction
) => {
  const { email_verify_token } = req.query
  const { user_id } = req.decode_email_verify_token as TokenPayLoad

  //kiểm tra xem user_id của token có khớp với lại email_verify_token
  //mà người dùng gửi lên không?
  const user = await userService.checkEmailVerifyToken({ user_id, email_verify_token })
  if (user.verify === UserVerifyStatus.Banned) {
    res.status(HTTP_STATUS.ACCEPTED).json({
      message: USERS_MESSAGES.ACCOUNT_HAS_BEEN_BANNED
    })
  } else {
    //verify email
    const result = await userService.verifyEmail(user_id)
    //kết quả
    res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
      result
    })
  }
}
export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { old_password, new_password } = req.body
  const { user_id } = req.decode_authorization as TokenPayLoad
  await userService.changePassword(user_id, old_password, new_password)
  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS
  })
}
