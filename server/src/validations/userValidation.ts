import Joi from 'joi'

const registerEmailValidation = Joi.object({
  email: Joi.string()
    .required()
    .max(60)
    .pattern(
      new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ),
})

const loginEmailValidation = Joi.object({
  email: Joi.string()
    .required()
    .max(60)
    .pattern(
      new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ),
})

const confirmCodeValidation = Joi.object({
  code: Joi.string()
    .required()
    .max(4)
    .pattern(new RegExp(/^[0-9A-Z]{4}$/)),
  email: Joi.string()
    .required()
    .max(60)
    .pattern(
      new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ),
})

export { registerEmailValidation, loginEmailValidation, confirmCodeValidation }
