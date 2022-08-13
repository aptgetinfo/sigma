const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { blockchain } = require('../config/blockchain');
const { category } = require('../config/category');

exports.createCommunity = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    category: Joi.array()
      .items(Joi.string().valid(...category))
      .required(),
    blockchain: Joi.string()
      .valid(...blockchain)
      .required(),
    twitter: Joi.string().trim().required(),
    telegram: Joi.string().trim(),
    discord: Joi.string().trim().required(),
    website: Joi.string().trim(),
    opensea: Joi.string().trim(),
  }),
};

exports.getCommunitys = {
  query: Joi.object().keys({
    name: Joi.string(),
    category: Joi.string(),
    blockchain: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

exports.getCommunity = {
  params: Joi.object().keys({
    communityId: Joi.string().custom(objectId),
  }),
};

exports.updateCommunity = {
  params: Joi.object().keys({
    communityId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      category: Joi.array().items(Joi.string().valid(...category)),
      blockchain: Joi.string().valid(...blockchain),
      description: Joi.string(),
      twitter: Joi.string().trim(),
      telegram: Joi.string().trim(),
      discord: Joi.string().trim(),
      website: Joi.string().trim(),
      opensea: Joi.string().trim(),
      isPublic: Joi.boolean(),
      moderators: Joi.array().items(Joi.string().custom(objectId)),
    })
    .min(1),
};

exports.deleteCommunity = {
  params: Joi.object().keys({
    communityId: Joi.string().custom(objectId),
  }),
};
