import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  RABBIT_MQ_URI: Joi.string().required(),
});
