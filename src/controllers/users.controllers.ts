import { Request, Response } from 'express'
import User from '~/models/User.schema'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.requests'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'tranhuuphuoccp@gmail.com' && password === '123123123') {
    res.json({
      data: {
        fname: 'Phước',
        yob: 2004,
        time: new Date().toLocaleString()
      }
    })
  } else {
    res.status(400).json({
      err: 'Invalid email or password'
    })
  }
}
export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const { email, password } = req.body
  try {
    const isEmailExist = await userService.checkEmailExist(req.body.email)
    if (isEmailExist) {
      const errCustom = new Error('Email already in use')
      Object.defineProperty(errCustom, 'message', {
        enumerable: true
      })
      throw errCustom
    }

    const result = await userService.register(req.body)
    console.log(result)
    return res.status(200).json({
      message: 'Register successful',
      result: result
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Register failed', //chỉnh lại thông báo
      err: err
    })
  }
}
