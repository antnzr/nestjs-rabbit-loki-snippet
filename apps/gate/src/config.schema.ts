import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  GATE_PORT: Joi.number().required(),
  RABBIT_MQ_URI: Joi.string().required(),
});
