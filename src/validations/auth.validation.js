const Joi = require('joi');
const { password } = require('./custom.validation');

exports.register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    // phone: Joi.object().keys({
    //   countryCode: Joi.string().required(),
    //   number: Joi.string().required(),
    // }),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};

// exports.registerVerification = {
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().custom(password),
//     phoneCode: Joi.string().required(),
//     emailCode: Joi.string().required(),
//   }),
// };

exports.login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    // type: Joi.number().valid(0, 1).required(),
  }),
};

// exports.loginVerification = {
//   body: Joi.object().keys({
//     email: Joi.string().required(),
//     password: Joi.string().required(),
//     type: Joi.number().valid(0, 1).required(),
//     code: Joi.string().required(),
//   }),
// };

exports.logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

exports.refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

exports.forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

exports.resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

exports.verifyEmail = {
  body: Joi.object().keys({
    code: Joi.string().required(),
  }),
};

exports.verifySms = {
  body: Joi.object().keys({
    code: Joi.string().required(),
  }),
};
