import { checkSchema, param, ParamSchema } from 'express-validator'
import { validate } from '~/utils/validation'

const brandNameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Brand name is required'
  },
  isLength: {
    options: { min: 2, max: 100 },
    errorMessage: 'Brand name must be between 2 and 100 characters'
  }
}

const updateBrandNameSchema: ParamSchema = { optional: true, ...brandNameSchema }

export const addBrandValidator = validate(
  checkSchema(
    {
      brandName: brandNameSchema
    },
    ['body']
  )
)
export const updateBrandValidator = validate(
  checkSchema(
    {
      id: {
        in: ['params'],
        isMongoId: {
          errorMessage: 'Invalid product id'
        }
      },
      brandName: updateBrandNameSchema
    },
    ['params', 'body']
  )
)
