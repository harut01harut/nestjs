import * as Joi from 'joi'

export default Joi.object({
    NODE_ENV: Joi.string().valid('development', 'test', 'staging')
    .default('development'),
    DATABASE_PORT: Joi.number().port().default(5432),
    DATABASE_PASS: Joi.string().required(),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_NAME: Joi.string().required(),
    DATABASE_USER: Joi.string().required()
})