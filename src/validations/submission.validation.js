const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { submissionTypes } = require('../config/constants');

exports.createSubmission = {
  body: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
    entry: Joi.array()
      .items(
        Joi.object().keys({
          at: Joi.number().required(),
          submission: Joi.string().valid(submissionTypes).required(),
          info: Joi.string().required(),
        })
      )
      .required(),
  }),
};

exports.getSubmissions = {
  query: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
    communityId: Joi.string().custom(objectId),
    userId: Joi.string().custom(objectId),
    isCompleted: Joi.boolean(),
    isReviewed: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

exports.getSubmission = {
  params: Joi.object().keys({
    submissionId: Joi.string().custom(objectId),
  }),
};

exports.updateSubmission = {
  params: Joi.object().keys({
    submissionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      isCompleted: Joi.boolean(),
      isReviewed: Joi.boolean(),
    })
    .min(1),
};

exports.deleteSubmission = {
  params: Joi.object().keys({
    submissionId: Joi.string().custom(objectId),
  }),
};
