const Joi = require('joi');
const { objectId } = require('./custom.validation');

exports.getTransactions = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    taskId: Joi.string().custom(objectId),
    communityId: Joi.string().custom(objectId),
    submissionId: Joi.string().custom(objectId),
    reward: Joi.number().integer(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

exports.getTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().custom(objectId),
  }),
};
