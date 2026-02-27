import { checkSchema, ParamSchema } from 'express-validator'
import { PERFUME_MESSAGES } from '~/containts/messages'
import Brand from '~/models/schemas/Brand.schema'
import { validate } from '~/utils/validation'

const perfumeNameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PERFUME_MESSAGES.PERFUME_NAME_IS_REQUIRED
  },
  isString: {
    errorMessage: PERFUME_MESSAGES.PERFUME_NAME_MUST_BE_A_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 50
    },
    errorMessage: PERFUME_MESSAGES.PERFUME_NAME_LENGTH_MUST_BE_FROM_1_TO_50
  }
}
const uriSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PERFUME_MESSAGES.URI_IS_REQUIRED
  },
  isString: {
    errorMessage: PERFUME_MESSAGES.URI_MUST_BE_A_STRING
  },
  trim: true
}
const priceSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PERFUME_MESSAGES.PRICE_IS_REQUIRED
  },
  isNumeric: {
    errorMessage: PERFUME_MESSAGES.PRICE_MUST_BE_A_NUMBER
  }
}
const concentrationSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PERFUME_MESSAGES.CONCENTRATION_IS_REQUIRED
  },
  isString: {
    errorMessage: PERFUME_MESSAGES.CONCENTRATION_MUST_BE_A_STRING
  },
  trim: true
}
const descriptionSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PERFUME_MESSAGES.DESCRIPTION_IS_REQUIRED
  },
  isString: {
    errorMessage: PERFUME_MESSAGES.DESCRIPTION_MUST_BE_A_STRING
  },
  trim: true
}
const ingredientsSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PERFUME_MESSAGES.INGREDIENTS_IS_REQUIRED
  },
  isString: {
    errorMessage: PERFUME_MESSAGES.INGREDIENTS_MUST_BE_A_STRING
  },
  trim: true
}
const volumeSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PERFUME_MESSAGES.VOLUME_IS_REQUIRED
  },
  isNumeric: {
    errorMessage: PERFUME_MESSAGES.VOLUME_MUST_BE_A_NUMBER
  }
}
const targetAudienceSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PERFUME_MESSAGES.TARGET_AUDIENCE_IS_REQUIRED
  },
  isString: {
    errorMessage: PERFUME_MESSAGES.TARGET_AUDIENCE_MUST_BE_A_STRING
  },
  trim: true
}
const brandSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PERFUME_MESSAGES.BRAND_IS_REQUIRED
  },
  isMongoId: {
    errorMessage: PERFUME_MESSAGES.BRAND_MUST_BE_A_MONGO_ID
  }
}

export const addPerfumeValidator = validate(
  checkSchema(
    {
      perfumeName: perfumeNameSchema,
      uri: uriSchema,
      price: priceSchema,
      concentration: concentrationSchema,
      description: descriptionSchema,
      ingredients: ingredientsSchema,
      volume: volumeSchema,
      targetAudience: targetAudienceSchema,
      brand: brandSchema
    },
    ['body']
  )
)
