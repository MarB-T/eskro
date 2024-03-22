import Joi from '@hapi/joi';

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().min(6).required(),
    phoneNumber: Joi.string().min(10).required(),
    // address: Joi.string().min(3).required(),
  });

  return schema.validate(user);
}

const validateLogin = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(user);
}

export { validateUser, validateLogin };