const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { submissionTypes, verificationTypes } = require('../config/constants');

exports.createTask = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    mission: Joi.string().required(),
    guidelines: Joi.array()
      .items(
        Joi.object().keys({
          at: Joi.number().required(),
          guide: Joi.string().required(),
        })
      )
      .required(),
    submissionType: Joi.array()
      .items(
        Joi.object().keys({
          at: Joi.number().required(),
          submission: Joi.string().valid(submissionTypes).required(),
        })
      )
      .required(),
    verificationType: Joi.array().items(Joi.string().valid(verificationTypes).required()).required(),
    reward: Joi.number().required(),
    taskLevel: Joi.number().required(),
    conditionLevel: Joi.number(),
  }),
};

exports.getTasks = {
  query: Joi.object().keys({
    name: Joi.string(),
    communityId: Joi.string().custom(objectId),
    reward: Joi.number(),
    taskLevel: Joi.number(),
    conditionLevel: Joi.number(),
    isLive: Joi.boolean(),
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
      guidelines: Joi.array().items(
        Joi.object().keys({
          at: Joi.number().required(),
          guide: Joi.string().required(),
        })
      ),
      submissionType: Joi.array().items(
        Joi.object().keys({
          at: Joi.number().required(),
          submission: Joi.string().valid(submissionTypes).required(),
        })
      ),
      verificationType: Joi.array().items(Joi.string().valid(verificationTypes).required()),
      reward: Joi.number(),
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
