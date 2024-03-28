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

const validateContract = (contract) => {
  const schema = Joi.object({
    seller: Joi.string().required().length(24),
    buyer: Joi.string().required().length(24),
    description: Joi.string().required(),
    price: Joi.number().required(),
    deadline: Joi.date().required(),
  });

  return schema.validate(contract);
}

export { validateUser, validateLogin, validateContract };