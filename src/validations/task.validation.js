const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { submissionType } = require('../config/submissionType');
//TODO Task Category to be added
exports.createTask = {
  body: Joi.object().keys({
    communityId: Joi.string().custom(objectId).required(),
    name: Joi.string().required(),
    mission: Joi.string(),
    guidelines: Joi.string(),
    submissionDetails: Joi.string(),
    submissionType: Joi.string()
      .valid(...Object.values(submissionType))
      .required(),
    rewards: Joi.number().required(),
    taskLevel: Joi.number().required(),
    conditionLevel: Joi.number().default(0),
    isLive: Joi.boolean().default(false),
  }),
};

exports.getTasks = {
  query: Joi.object().keys({
    name: Joi.string(),
    communityId: Joi.string().custom(objectId),
    submissionType: Joi.string(),
    rewards: Joi.number(),
    taskLevel: Joi.number(),
    conditionLevel: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

exports.getTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
  }),
};

exports.updateTask = {
  params: Joi.object().keys({
    taskId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      mission: Joi.string(),
      guidelines: Joi.string(),
      submissionDetails: Joi.string(),
      submissionType: Joi.string().valid(...Object.values(submissionType)),
      rewards: Joi.number(),
      taskLevel: Joi.number(),
      conditionLevel: Joi.number(),
      isLive: Joi.boolean(),
    })
    .min(1),
};

exports.deleteTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
  }),
};
