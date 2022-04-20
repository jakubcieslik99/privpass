import Joi from 'joi'

const createPasswordValidation = Joi.object({
  name: Joi.string().required().max(40),
  password: Joi.string().required().max(60),
})

const updatePasswordValidation = Joi.object({
  name: Joi.string().required().max(40),
  password: Joi.string().required().max(60),
})

export { createPasswordValidation, updatePasswordValidation }
