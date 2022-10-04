const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { blockchain } = require('../config/constants');
const { category } = require('../config/constants');

exports.getCommunitys = {
  query: Joi.object().keys({
    name: Joi.string(),
    category: Joi.array().items(Joi.string().valid(...Object.values(category))),
    blockchain: Joi.string().valid(...Object.values(blockchain)),
    isPublic: Joi.boolean(),
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
      category: Joi.array().items(Joi.string().valid(category)),
      blockchain: Joi.string().valid(blockchain),
      description: Joi.string(),
      website: Joi.string().trim(),
      linkedin: Joi.string().trim(),
      isPublic: Joi.boolean(),
    })
    .min(1),
  file: Joi.any(),
};

exports.deleteCommunity = {
  params: Joi.object().keys({
    communityId: Joi.string().custom(objectId),
  }),
};
