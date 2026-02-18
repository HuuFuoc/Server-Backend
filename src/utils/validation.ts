import express from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import HTTP_STATUS from '~/containts/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Error'

// export ở ngoài xài đc hàm validate
//đổi thành RunnableValidationChains<ValidationChain>
//vì tý nữa validate sẽ đc xài thế này validate(checkShema({...}))
//mà checkShema() nó là(return) ra RunnableValidationChains<ValidationChain>
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req) //hàm tìm lỗi của middleware schema và đưa vào req

    const errors = validationResult(req) //funct này giúp ta lấy lỗi ra từ biến req
    if (errors.isEmpty()) {
      return next()
    }
    const errorObject = errors.mapped() //hàm này giúp ta lấy lỗi ra dưới dạng object
    const entityError = new EntityError({ errors: {} })
    for (const key in errorObject) {
      const { msg } = errorObject[key]
      if (msg instanceof ErrorWithStatus && msg.status != HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        next(msg)
      }
      entityError.errors[key] = errorObject[key].msg
    }
    next(entityError)
  }
}
