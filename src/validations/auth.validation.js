const Joi = require('joi');

exports.twitterVerify = {
  query: Joi.object().keys({
    oauth_token: Joi.string().required(),
    oauth_verifier: Joi.string().required(),
  }),
};

exports.discordLogin = {
  query: Joi.object().keys({
    code: Joi.string().required(),
    state: Joi.string().required(),
  }),
};

exports.discordBotLogin = {
  query: Joi.object().keys({
    code: Joi.string().required(),
    state: Joi.string().required(),
    guild_id: Joi.string().required(),
    permissions: Joi.string().required(),
  }),
};

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
