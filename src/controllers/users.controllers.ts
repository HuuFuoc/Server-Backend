import { NextFunction, Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { loginReqBody, RegisterReqBody } from '~/models/requests/User.requests'
import { ErrorWithStatus } from '~/models/Error'
import { ppid } from 'node:process'
import HTTP_STATUS from '~/containts/httpStatus'
import { USERS_MESSAGES } from '~/containts/messages'

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
export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
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
