const Joi = require('joi');
const { objectId } = require('./custom.validation');

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
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      // email: Joi.string().email(),
      // phone: Joi.object().keys({
      //   countryCode: Joi.string(),
      //   number: Joi.string(),
      // }),
      description: Joi.string(),
      // TODO wallet address verificationChecks
      walletAddress: Joi.string(),
      // TODO link verificationChecks
      // twitter: Joi.string(),
      // discord: Joi.string(),
      // telegram: Joi.string(),
      // website: Joi.string(),
    })
    .min(1),
  // file: Joi.any(),
};

exports.deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
