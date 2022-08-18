const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { blockchain } = require('../config/blockchain');
const { category } = require('../config/category');

exports.createCommunity = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    category: Joi.array()
      .items(Joi.string().valid(...Object.values(category)))
      .required(),
    blockchain: Joi.string()
      .valid(...Object.values(blockchain))
      .required(),
    // TODO: uri validation to be added in other schemas
    twitter: Joi.string().uri().trim().required(),
    telegram: Joi.string().uri().trim(),
    discord: Joi.string().uri().trim().required(),
    website: Joi.string().uri().trim(),
    opensea: Joi.string().uri().trim(),
  }),
  file: Joi.any().required(),
};

exports.getCommunitys = {
  query: Joi.object().keys({
    name: Joi.string(),
    category: Joi.array().items(Joi.string().valid(...Object.values(category))),
    blockchain: Joi.string().valid(...Object.values(blockchain)),
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
      category: Joi.array().items(Joi.string().valid(...Object.values(category))),
      blockchain: Joi.string().valid(blockchain),
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
  file: Joi.any(),
};

exports.deleteCommunity = {
  params: Joi.object().keys({
    communityId: Joi.string().custom(objectId),
  }),
};
