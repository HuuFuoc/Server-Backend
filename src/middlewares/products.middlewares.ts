import dotenv from 'dotenv'
import { checkSchema, ParamSchema } from 'express-validator'
import { PRODUCTS_MESSAGES } from '~/containts/messages'
import { validate } from '~/utils/validation'

dotenv.config()
const handbagNameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCTS_MESSAGES.HANDBAG_NAME_IS_REQUIRED
  },
  isString: {
    errorMessage: PRODUCTS_MESSAGES.HANDBAG_NAME_MUST_BE_A_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 50
    },
    errorMessage: PRODUCTS_MESSAGES.HANDBAG_NAME_LENGTH_MUST_BE_FROM_1_TO_50
  }
}
const costSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCTS_MESSAGES.COST_IS_REQUIRED
  },
  isNumeric: {
    errorMessage: PRODUCTS_MESSAGES.COST_MUST_BE_A_NUMBER
  }
}
const categorySchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCTS_MESSAGES.CATEGORY_IS_REQUIRED
  },
  isString: {
    errorMessage: PRODUCTS_MESSAGES.CATEGORY_MUST_BE_A_STRING
  },
  trim: true
}
const colorSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCTS_MESSAGES.COLOR_IS_REQUIRED
  }
}
const genderSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCTS_MESSAGES.GENDER_IS_REQUIRED
  },
  isBoolean: {
    errorMessage: PRODUCTS_MESSAGES.GENDER_MUST_BE_BOOLEAN
  }
}
const uriSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCTS_MESSAGES.URI_IS_REQUIRED
  },
  isString: {
    errorMessage: PRODUCTS_MESSAGES.URI_MUST_BE_A_STRING
  },
  trim: true
}
const brandSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCTS_MESSAGES.BRAND_IS_REQUIRED
  },
  isString: {
    errorMessage: PRODUCTS_MESSAGES.BRAND_MUST_BE_A_STRING
  },
  trim: true
}
const percentOffSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCTS_MESSAGES.PERCENT_OFF_IS_REQUIRED
  },
  isNumeric: {
    errorMessage: PRODUCTS_MESSAGES.PERCENT_OFF_MUST_BE_A_NUMBER
  }
}
const handbagNameUpdateSchema: ParamSchema = { optional: true, ...handbagNameSchema }
delete handbagNameUpdateSchema.notEmpty

const costUpdateSchema: ParamSchema = { optional: true, ...costSchema }
delete costUpdateSchema.notEmpty

const categoryUpdateSchema: ParamSchema = { optional: true, ...categorySchema }
delete categoryUpdateSchema.notEmpty

const colorUpdateSchema: ParamSchema = { optional: true, ...colorSchema }
delete colorUpdateSchema.notEmpty

const genderUpdateSchema: ParamSchema = { optional: true, ...genderSchema }
delete genderUpdateSchema.notEmpty

const uriUpdateSchema: ParamSchema = { optional: true, ...uriSchema }
delete uriUpdateSchema.notEmpty

const brandUpdateSchema: ParamSchema = { optional: true, ...brandSchema }
delete brandUpdateSchema.notEmpty

const percentOffUpdateSchema: ParamSchema = { optional: true, ...percentOffSchema }
delete percentOffUpdateSchema.notEmpty
export const addProductValidator = validate(
  checkSchema(
    {
      handbagName: handbagNameSchema,
      cost: costSchema,
      category: categorySchema,
      color: colorSchema,
      gender: genderSchema,
      uri: uriSchema,
      brand: brandSchema,
      percentOff: percentOffSchema
    },
    ['body']
  )
)
export const updateProductValidator = validate(
  checkSchema(
    {
      id: {
        in: ['params'],
        isMongoId: {
          errorMessage: 'Invalid product id'
        }
      },
      handbagName: handbagNameUpdateSchema,
      cost: costUpdateSchema,
      category: categoryUpdateSchema,
      color: colorUpdateSchema,
      gender: genderUpdateSchema,
      uri: uriUpdateSchema,
      brand: brandUpdateSchema,
      percentOff: percentOffUpdateSchema
    },
    ['body', 'params']
  )
)
