const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

exports.createUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.object().keys({
      countryCode: Joi.string().required(),
      number: Joi.string().required(),
    }),
    password: Joi.string().required().custom(password),
    description: Joi.string(),
    //TODO wallet address verification
    walletAddress: Joi.string(),
    //TODO link verification
    twitter: Joi.string(),
    discord: Joi.string(),
    telegram: Joi.string(),
    website: Joi.string(),
  }),
};

exports.getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    walletAddress: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

exports.getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

exports.updateUser = {
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      email: Joi.string().email(),
      phone: Joi.object().keys({
        countryCode: Joi.string(),
        number: Joi.string(),
      }),
      password: Joi.string().custom(password),
      description: Joi.string(),
      walletAddress: Joi.string(),
      twitter: Joi.string(),
      discord: Joi.string(),
      telegram: Joi.string(),
      website: Joi.string(),
    })
    .min(1),
};

// exports.deleteUser = {
//   params: Joi.object().keys({
//     userId: Joi.string().custom(objectId),
//   }),
// };
