import { checkSchema, ParamSchema } from 'express-validator'
import { COMMENTS_MESSAGES } from '../constants/messages'
import { validate } from '../utils/validation'

const commentSchema: ParamSchema = {
  notEmpty: {
    errorMessage: COMMENTS_MESSAGES.CONTENT_IS_REQUIRED
  },
  isString: {
    errorMessage: COMMENTS_MESSAGES.CONTENT_MUST_BE_A_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 500
    },
    errorMessage: COMMENTS_MESSAGES.CONTENT_LENGTH_MUST_BE_FROM_1_TO_500
  }
}

const ratingSchema: ParamSchema = {
  notEmpty: {
    errorMessage: COMMENTS_MESSAGES.RATING_IS_REQUIRED
  },
  isNumeric: {
    errorMessage: COMMENTS_MESSAGES.RATING_MUST_BE_A_NUMBER
  }
}
export const postCommentValidator = validate(
  checkSchema({
    content: commentSchema,
    rating: ratingSchema
  })
)
